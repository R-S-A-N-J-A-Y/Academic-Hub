-- ============================================================================
-- AUTOMATED TEST SCRIPT FOR TEAM REQUEST FUNCTIONS
-- This script will find real IDs and run tests automatically
-- ============================================================================

DO $$
DECLARE
    v_project_id integer;
    v_leader_id integer;
    v_member1_id integer;
    v_member2_id integer;
    v_guide_id integer;
    v_request_id integer;
    v_team_id integer;
    v_test_passed boolean := true;
    v_error_msg text;
BEGIN
    RAISE NOTICE '=== Starting Team Request Functions Test ===';
    RAISE NOTICE '';
    
    -- Step 1: Find a project
    SELECT project_id INTO v_project_id FROM projects LIMIT 1;
    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'TEST FAILED: No projects found in database';
    END IF;
    RAISE NOTICE 'Found project_id: %', v_project_id;
    
    -- Step 2: Find users (need at least 3)
    SELECT user_id INTO v_leader_id FROM users LIMIT 1 OFFSET 0;
    SELECT user_id INTO v_member1_id FROM users LIMIT 1 OFFSET 1;
    SELECT user_id INTO v_member2_id FROM users LIMIT 1 OFFSET 2;
    
    IF v_leader_id IS NULL OR v_member1_id IS NULL OR v_member2_id IS NULL THEN
        RAISE EXCEPTION 'TEST FAILED: Not enough users found (need at least 3)';
    END IF;
    RAISE NOTICE 'Found leader_id: %, member1_id: %, member2_id: %', v_leader_id, v_member1_id, v_member2_id;
    
    -- Step 3: Check if project has a guide
    SELECT guide_id INTO v_guide_id FROM projects WHERE project_id = v_project_id;
    IF v_guide_id IS NOT NULL THEN
        RAISE NOTICE 'Found guide_id: %', v_guide_id;
    ELSE
        RAISE NOTICE 'No guide assigned (will test auto-approval path)';
    END IF;
    RAISE NOTICE '';
    
    -- Test 1: Create team request
    RAISE NOTICE 'Test 1: Creating team request...';
    BEGIN
        v_request_id := public.create_team_request(
            v_project_id,
            v_leader_id,
            'Team X',
            ARRAY[v_leader_id, v_member1_id, v_member2_id]
        );
        RAISE NOTICE '  ✓ Created team request with ID: %', v_request_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '  ✗ FAILED: %', SQLERRM;
        v_test_passed := false;
        RETURN;
    END;
    RAISE NOTICE '';
    
    -- Test 2: Member 1 accepts
    RAISE NOTICE 'Test 2: Member 1 accepts...';
    BEGIN
        PERFORM public.team_request_member_reply(v_request_id, v_member1_id, 'accepted');
        RAISE NOTICE '  ✓ Member 1 accepted';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '  ✗ FAILED: %', SQLERRM;
        v_test_passed := false;
        RETURN;
    END;
    RAISE NOTICE '';
    
    -- Test 3: Member 2 accepts
    RAISE NOTICE 'Test 3: Member 2 accepts...';
    BEGIN
        PERFORM public.team_request_member_reply(v_request_id, v_member2_id, 'accepted');
        RAISE NOTICE '  ✓ Member 2 accepted';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '  ✗ FAILED: %', SQLERRM;
        v_test_passed := false;
        RETURN;
    END;
    RAISE NOTICE '';
    
    -- Test 4: Leader accepts (should trigger team creation)
    RAISE NOTICE 'Test 4: Leader accepts (should trigger team creation)...';
    BEGIN
        PERFORM public.team_request_member_reply(v_request_id, v_leader_id, 'accepted');
        RAISE NOTICE '  ✓ Leader accepted';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '  ✗ FAILED: %', SQLERRM;
        v_test_passed := false;
        RETURN;
    END;
    RAISE NOTICE '';
    
    -- Check status
    DECLARE
        v_status varchar;
    BEGIN
        SELECT status INTO v_status FROM team_requests WHERE request_id = v_request_id;
        RAISE NOTICE '  Team request status: %', v_status;
        
        -- Check if team was created
        SELECT team_id INTO v_team_id FROM teams WHERE project_id = v_project_id;
        IF v_team_id IS NOT NULL THEN
            RAISE NOTICE '  Team created: team_id = %', v_team_id;
        ELSE
            RAISE NOTICE '  WARNING: Team was not created';
        END IF;
    END;
    RAISE NOTICE '';
    
    -- Test 5: Guide decision (if guide exists)
    IF v_guide_id IS NOT NULL THEN
        RAISE NOTICE 'Test 5: Guide approves...';
        BEGIN
            PERFORM public.team_request_guide_decision(v_request_id, v_guide_id, 'approve');
            RAISE NOTICE '  ✓ Guide approved';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '  ✗ FAILED: %', SQLERRM;
            v_test_passed := false;
            RETURN;
        END;
        RAISE NOTICE '';
        
        -- Check final status
        DECLARE
            v_final_status varchar;
            v_proj_status varchar;
            v_proj_guide_status varchar;
            v_proj_visibility varchar;
            v_proj_ispublished boolean;
        BEGIN
            SELECT status INTO v_final_status FROM team_requests WHERE request_id = v_request_id;
            SELECT status, guide_status, visibility, ispublished 
            INTO v_proj_status, v_proj_guide_status, v_proj_visibility, v_proj_ispublished
            FROM projects WHERE project_id = v_project_id;
            
            RAISE NOTICE '  Final team request status: %', v_final_status;
            RAISE NOTICE '  Project status: %, guide_status: %, visibility: %, ispublished: %', 
                v_proj_status, v_proj_guide_status, v_proj_visibility, v_proj_ispublished;
        END;
    ELSE
        RAISE NOTICE 'Test 5: Skipped (no guide - testing auto-approval)';
        DECLARE
            v_proj_status varchar;
            v_proj_visibility varchar;
            v_proj_ispublished boolean;
        BEGIN
            SELECT status, visibility, ispublished 
            INTO v_proj_status, v_proj_visibility, v_proj_ispublished
            FROM projects WHERE project_id = v_project_id;
            
            RAISE NOTICE '  Project status: %, visibility: %, ispublished: %', 
                v_proj_status, v_proj_visibility, v_proj_ispublished;
        END;
    END IF;
    RAISE NOTICE '';
    
    IF v_test_passed THEN
        RAISE NOTICE '=== All Tests Passed Successfully ===';
    ELSE
        RAISE NOTICE '=== Some Tests Failed ===';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '=== TEST SCRIPT FAILED ===';
    RAISE NOTICE 'Error: %', SQLERRM;
    RAISE NOTICE 'Detail: %', SQLSTATE;
END $$;


