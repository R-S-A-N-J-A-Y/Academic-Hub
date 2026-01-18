# Team Request Functions Implementation

## Overview
This implementation provides PL/pgSQL functions and triggers for managing team requests in the Academic Hub database.

## Files Created

1. **team_request_functions.sql** - Contains all function definitions and the trigger
2. **team_request_functions_with_tests.sql** - Functions + commented test queries
3. **test_team_request_functions.sql** - Automated test script that finds IDs and runs tests
4. **execute_team_request_functions.js** - Node.js script to execute SQL (requires .env)

## Functions Implemented

### 1. `create_team_request(p_project_id, p_leader_id, p_requested_team_name, p_member_ids)`
Creates a team request with invited members.

**Parameters:**
- `p_project_id` (integer): Project ID
- `p_leader_id` (integer): Leader user ID
- `p_requested_team_name` (varchar): Team name
- `p_member_ids` (integer[]): Array of user IDs (must include leader)

**Returns:** `request_id` (integer)

**Validations:**
- Project must exist
- Leader must exist
- Leader must be in member_ids array
- All member IDs must exist in users table

### 2. `team_request_member_reply(p_request_id, p_user_id, p_reply_status)`
Handles member replies (accepted/rejected) and triggers processing.

**Parameters:**
- `p_request_id` (integer): Request ID
- `p_user_id` (integer): User ID replying
- `p_reply_status` (varchar): 'accepted' or 'rejected'

**Returns:** void

**Behavior:**
- Updates member reply status
- If any member rejects → cancels request
- If all members accept → calls `process_team_request`

### 3. `process_team_request(p_request_id)` (Internal)
Processes the team request when all members have accepted.

**Parameters:**
- `p_request_id` (integer): Request ID

**Returns:** void

**Behavior:**
- Creates team in `teams` table
- Creates team members in `team_members` table
- If project has guide → sets status to 'forwarded_to_guide', sets projects.guide_status = 'pending'
- If project has no guide → sets status to 'members_confirmed', auto-approves project

### 4. `team_request_guide_decision(p_request_id, p_guide_user_id, p_decision, p_comment)`
Handles guide approval/rejection.

**Parameters:**
- `p_request_id` (integer): Request ID
- `p_guide_user_id` (integer): Guide user ID (must match project's guide)
- `p_decision` (varchar): 'approve' or 'reject'
- `p_comment` (text, optional): Comment

**Returns:** void

**Behavior:**
- Validates caller is the project's guide
- If approve → updates project and request status, publishes project
- If reject → updates status, deletes team and team_members

## Trigger

### `team_requests_updated_at_trigger`
Automatically updates `updated_at` timestamp on `team_requests` table before updates.

## How to Execute

### Option 1: Supabase SQL Editor (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste contents of `team_request_functions.sql`
3. Click "Run" to create functions
4. Copy and paste contents of `test_team_request_functions.sql`
5. Click "Run" to execute automated tests

### Option 2: Node.js Script
```bash
cd Backend/db
node execute_team_request_functions.js
```
(Requires .env file with database credentials)

### Option 3: psql Command Line
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f team_request_functions.sql
psql -h db.xxx.supabase.co -U postgres -d postgres -f test_team_request_functions.sql
```

## Testing

The `test_team_request_functions.sql` script will:
1. Find a real project_id from your database
2. Find 3 user_ids (leader, member1, member2)
3. Check if project has a guide
4. Run through the complete workflow:
   - Create team request
   - Member 1 accepts
   - Member 2 accepts
   - Leader accepts (triggers team creation)
   - Guide approves (if guide exists)

## Expected Results

### With Guide:
1. Request created → status: 'waiting_for_members'
2. All members accept → status: 'forwarded_to_guide', team created
3. Guide approves → status: 'guide_approved', project published

### Without Guide:
1. Request created → status: 'waiting_for_members'
2. All members accept → status: 'members_confirmed', project auto-approved

## Notes

- Uses `pg_advisory_xact_lock` for concurrency safety
- Uses cursor-based iteration for member processing
- All operations are transactional
- Comprehensive error handling with clear messages
- Validates all inputs before processing


