-- PL/pgSQL Functions for Team Request Workflow
-- This file contains all functions and triggers for the team request system

-- ============================================================================
-- Function 1: create_team_request
-- Creates a team request with invited members
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_team_request(
    p_project_id integer,
    p_leader_id integer,
    p_requested_team_name varchar,
    p_member_ids integer[]
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    v_request_id integer;
    v_member_id integer;
    v_project_exists boolean;
    v_leader_exists boolean;
BEGIN
    -- Validate project exists
    SELECT EXISTS(SELECT 1 FROM projects WHERE project_id = p_project_id) INTO v_project_exists;
    IF NOT v_project_exists THEN
        RAISE EXCEPTION 'Project with id % does not exist', p_project_id;
    END IF;
    
    -- Validate leader exists
    SELECT EXISTS(SELECT 1 FROM users WHERE user_id = p_leader_id) INTO v_leader_exists;
    IF NOT v_leader_exists THEN
        RAISE EXCEPTION 'Leader with id % does not exist', p_leader_id;
    END IF;
    
    -- Check if leader is in member_ids array
    IF NOT (p_leader_id = ANY(p_member_ids)) THEN
        RAISE EXCEPTION 'Leader must be included in member_ids array';
    END IF;
    
    -- Validate all member IDs exist
    IF EXISTS (
        SELECT 1 FROM unnest(p_member_ids) AS member_id
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_id = member_id)
    ) THEN
        RAISE EXCEPTION 'One or more member IDs do not exist in users table';
    END IF;
    
    -- Insert team request
    INSERT INTO team_requests (
        project_id,
        leader_id,
        requested_team_name,
        status
    ) VALUES (
        p_project_id,
        p_leader_id,
        p_requested_team_name,
        'waiting_for_members'
    ) RETURNING request_id INTO v_request_id;
    
    -- Insert team request members
    FOREACH v_member_id IN ARRAY p_member_ids
    LOOP
        INSERT INTO team_request_members (
            request_id,
            user_id,
            reply_status
        ) VALUES (
            v_request_id,
            v_member_id,
            'pending'
        );
    END LOOP;
    
    RETURN v_request_id;
END;
$$;

-- ============================================================================
-- Function 2: process_team_request (Internal)
-- Processes the team request when all members have accepted
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_team_request(
    p_request_id integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_project_id integer;
    v_leader_id integer;
    v_requested_team_name varchar;
    v_guide_id integer;
    v_team_id integer;
    v_member_rec record;
    v_member_cursor CURSOR FOR
        SELECT user_id, role_in_request
        FROM team_request_members
        WHERE request_id = p_request_id;
BEGIN
    -- Get advisory lock to prevent concurrent processing
    PERFORM pg_advisory_xact_lock(p_request_id);
    
    -- Get request details
    SELECT project_id, leader_id, requested_team_name
    INTO v_project_id, v_leader_id, v_requested_team_name
    FROM team_requests
    WHERE request_id = p_request_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Team request with id % does not exist', p_request_id;
    END IF;
    
    -- Get project guide_id
    SELECT guide_id INTO v_guide_id
    FROM projects
    WHERE project_id = v_project_id;
    
    -- Create team
    INSERT INTO teams (
        project_id,
        team_name,
        guide_id
    ) VALUES (
        v_project_id,
        v_requested_team_name,
        v_guide_id
    ) RETURNING team_id INTO v_team_id;
    
    -- Add team members using cursor
    FOR v_member_rec IN v_member_cursor
    LOOP
        INSERT INTO team_members (
            team_id,
            user_id,
            role_in_team
        ) VALUES (
            v_team_id,
            v_member_rec.user_id,
            CASE 
                WHEN v_member_rec.user_id = v_leader_id THEN 'leader'
                ELSE COALESCE(v_member_rec.role_in_request, 'member')
            END
        );
    END LOOP;
    
    -- Update team_requests status and projects based on guide presence
    IF v_guide_id IS NOT NULL THEN
        -- Has guide: forward to guide
        UPDATE team_requests
        SET status = 'forwarded_to_guide'
        WHERE request_id = p_request_id;
        
        UPDATE projects
        SET guide_status = 'pending'
        WHERE project_id = v_project_id;
    ELSE
        -- No guide: auto-approve
        UPDATE team_requests
        SET status = 'members_confirmed'
        WHERE request_id = p_request_id;
        
        UPDATE projects
        SET status = 'approved',
            visibility = 'public',
            ispublished = true
        WHERE project_id = v_project_id;
    END IF;
END;
$$;

-- ============================================================================
-- Function 3: team_request_member_reply
-- Handles member replies and triggers processing checks
-- ============================================================================
CREATE OR REPLACE FUNCTION public.team_request_member_reply(
    p_request_id integer,
    p_user_id integer,
    p_reply_status varchar
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_reply_exists boolean;
    v_current_status varchar;
    v_all_accepted boolean;
    v_any_rejected boolean;
    v_all_decided boolean;
    v_total_members integer;
    v_decided_members integer;
    v_member_rec record;
BEGIN
    -- Validate reply_status
    IF p_reply_status NOT IN ('accepted', 'rejected') THEN
        RAISE EXCEPTION 'reply_status must be ''accepted'' or ''rejected'', got: %', p_reply_status;
    END IF;
    
    -- Get advisory lock
    PERFORM pg_advisory_xact_lock(p_request_id);
    
    -- Check if member is part of this request
    SELECT EXISTS(
        SELECT 1 FROM team_request_members
        WHERE request_id = p_request_id AND user_id = p_user_id
    ) INTO v_reply_exists;
    
    IF NOT v_reply_exists THEN
        RAISE EXCEPTION 'User % is not a member of request %', p_user_id, p_request_id;
    END IF;
    
    -- Check current status of request
    SELECT status INTO v_current_status
    FROM team_requests
    WHERE request_id = p_request_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Team request with id % does not exist', p_request_id;
    END IF;
    
    -- Check if request is already in a terminal state
    IF v_current_status IN ('cancelled', 'guide_approved', 'guide_rejected', 'members_confirmed') THEN
        RAISE EXCEPTION 'Team request % is already in status: %', p_request_id, v_current_status;
    END IF;
    
    -- Update member reply
    UPDATE team_request_members
    SET reply_status = p_reply_status,
        replied_at = NOW()
    WHERE request_id = p_request_id AND user_id = p_user_id;
    
    -- Count members and their statuses using cursor
    SELECT COUNT(*) INTO v_total_members
    FROM team_request_members
    WHERE request_id = p_request_id;
    
    SELECT COUNT(*) INTO v_decided_members
    FROM team_request_members
    WHERE request_id = p_request_id
    AND reply_status IN ('accepted', 'rejected');
    
    -- Check if any member rejected
    SELECT EXISTS(
        SELECT 1 FROM team_request_members
        WHERE request_id = p_request_id
        AND reply_status = 'rejected'
    ) INTO v_any_rejected;
    
    -- Check if all members accepted
    SELECT NOT EXISTS(
        SELECT 1 FROM team_request_members
        WHERE request_id = p_request_id
        AND reply_status != 'accepted'
    ) INTO v_all_accepted;
    
    -- Decision logic
    IF v_any_rejected THEN
        -- Any rejection cancels the request
        UPDATE team_requests
        SET status = 'cancelled'
        WHERE request_id = p_request_id;
        RETURN;
    END IF;
    
    IF v_all_accepted THEN
        -- All accepted: process the request
        PERFORM public.process_team_request(p_request_id);
        RETURN;
    END IF;
    
    -- Otherwise, still waiting for more replies
END;
$$;

-- ============================================================================
-- Function 4: team_request_guide_decision
-- Handles guide approval/rejection
-- ============================================================================
CREATE OR REPLACE FUNCTION public.team_request_guide_decision(
    p_request_id integer,
    p_guide_user_id integer,
    p_decision varchar,
    p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_project_id integer;
    v_actual_guide_id integer;
    v_current_status varchar;
    v_team_id integer;
BEGIN
    -- Validate decision
    IF p_decision NOT IN ('approve', 'reject') THEN
        RAISE EXCEPTION 'decision must be ''approve'' or ''reject'', got: %', p_decision;
    END IF;
    
    -- Get advisory lock
    PERFORM pg_advisory_xact_lock(p_request_id);
    
    -- Get request details
    SELECT project_id, status
    INTO v_project_id, v_current_status
    FROM team_requests
    WHERE request_id = p_request_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Team request with id % does not exist', p_request_id;
    END IF;
    
    -- Verify request is in correct status
    IF v_current_status != 'forwarded_to_guide' THEN
        RAISE EXCEPTION 'Team request % is not in ''forwarded_to_guide'' status (current: %)', p_request_id, v_current_status;
    END IF;
    
    -- Get project's guide_id
    SELECT guide_id INTO v_actual_guide_id
    FROM projects
    WHERE project_id = v_project_id;
    
    IF v_actual_guide_id IS NULL THEN
        RAISE EXCEPTION 'Project % has no guide assigned', v_project_id;
    END IF;
    
    -- Verify caller is the project's guide
    IF v_actual_guide_id != p_guide_user_id THEN
        RAISE EXCEPTION 'User % is not the guide for project % (guide_id: %)', p_guide_user_id, v_project_id, v_actual_guide_id;
    END IF;
    
    -- Get team_id for this project
    SELECT team_id INTO v_team_id
    FROM teams
    WHERE project_id = v_project_id;
    
    IF p_decision = 'approve' THEN
        -- Approve: update project and request status
        UPDATE projects
        SET guide_status = 'approved',
            status = 'approved',
            visibility = 'public',
            ispublished = true
        WHERE project_id = v_project_id;
        
        UPDATE team_requests
        SET status = 'guide_approved'
        WHERE request_id = p_request_id;
    ELSE
        -- Reject: update status and delete team/team_members
        UPDATE projects
        SET guide_status = 'rejected',
            status = 'rejected'
        WHERE project_id = v_project_id;
        
        UPDATE team_requests
        SET status = 'guide_rejected'
        WHERE request_id = p_request_id;
        
        -- Delete team_members first (due to foreign key)
        IF v_team_id IS NOT NULL THEN
            DELETE FROM team_members
            WHERE team_id = v_team_id;
            
            -- Delete team
            DELETE FROM teams
            WHERE team_id = v_team_id;
        END IF;
    END IF;
END;
$$;

-- ============================================================================
-- Trigger: Update updated_at on team_requests
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_team_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER team_requests_updated_at_trigger
BEFORE UPDATE ON team_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_team_requests_updated_at();


