const pool = require('./dbConfig');
const fs = require('fs');
const path = require('path');

async function executeSQL() {
    const client = await pool.connect();
    try {
        console.log('=== Executing Team Request Functions SQL ===\n');
        
        // Read and execute the SQL file
        const sqlFile = path.join(__dirname, 'team_request_functions.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        await client.query('BEGIN');
        
        // Execute the SQL (split by semicolons for better error reporting)
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement.length > 0) {
                try {
                    await client.query(statement);
                    console.log(`✓ Executed statement ${i + 1}`);
                } catch (err) {
                    console.error(`✗ Error in statement ${i + 1}:`, err.message);
                    throw err;
                }
            }
        }
        
        await client.query('COMMIT');
        console.log('\n✓ All SQL statements executed successfully\n');
        
        // Now test with real IDs
        console.log('=== Testing Functions with Real Database IDs ===\n');
        
        // Get some real IDs from the database
        const projectResult = await client.query('SELECT project_id FROM projects LIMIT 1');
        const userResult = await client.query('SELECT user_id FROM users LIMIT 3');
        
        if (projectResult.rows.length === 0) {
            throw new Error('No projects found in database. Cannot test.');
        }
        
        if (userResult.rows.length < 3) {
            throw new Error(`Not enough users found (found ${userResult.rows.length}, need at least 3). Cannot test.`);
        }
        
        const projectId = projectResult.rows[0].project_id;
        const leaderId = userResult.rows[0].user_id;
        const member1Id = userResult.rows[1].user_id;
        const member2Id = userResult.rows[2].user_id;
        
        // Check if project has a guide
        const projectGuideResult = await client.query(
            'SELECT guide_id FROM projects WHERE project_id = $1',
            [projectId]
        );
        const guideId = projectGuideResult.rows[0]?.guide_id;
        
        console.log(`Using IDs:`);
        console.log(`  Project ID: ${projectId}`);
        console.log(`  Leader ID: ${leaderId}`);
        console.log(`  Member 1 ID: ${member1Id}`);
        console.log(`  Member 2 ID: ${member2Id}`);
        if (guideId) {
            console.log(`  Guide ID: ${guideId}`);
        } else {
            console.log(`  Guide ID: NULL (no guide assigned)`);
        }
        console.log('');
        
        // Test 1: Create team request
        console.log('Test 1: Creating team request...');
        const createResult = await client.query(
            `SELECT public.create_team_request($1, $2, $3, $4) AS request_id`,
            [projectId, leaderId, 'Team X', [leaderId, member1Id, member2Id]]
        );
        const requestId = createResult.rows[0].request_id;
        console.log(`✓ Created team request with ID: ${requestId}\n`);
        
        // Test 2: Member 1 accepts
        console.log('Test 2: Member 1 accepts...');
        await client.query(
            `SELECT public.team_request_member_reply($1, $2, $3)`,
            [requestId, member1Id, 'accepted']
        );
        console.log(`✓ Member 1 accepted\n`);
        
        // Test 3: Member 2 accepts
        console.log('Test 3: Member 2 accepts...');
        await client.query(
            `SELECT public.team_request_member_reply($1, $2, $3)`,
            [requestId, member2Id, 'accepted']
        );
        console.log(`✓ Member 2 accepted\n`);
        
        // Test 4: Leader accepts (should trigger team creation)
        console.log('Test 4: Leader accepts (should trigger team creation)...');
        await client.query(
            `SELECT public.team_request_member_reply($1, $2, $3)`,
            [requestId, leaderId, 'accepted']
        );
        console.log(`✓ Leader accepted\n`);
        
        // Check the status
        const statusResult = await client.query(
            'SELECT status FROM team_requests WHERE request_id = $1',
            [requestId]
        );
        console.log(`Team request status: ${statusResult.rows[0].status}`);
        
        // Check if team was created
        const teamResult = await client.query(
            'SELECT team_id, team_name FROM teams WHERE project_id = $1',
            [projectId]
        );
        if (teamResult.rows.length > 0) {
            console.log(`Team created: ID=${teamResult.rows[0].team_id}, Name=${teamResult.rows[0].team_name}`);
        }
        
        // Test 5: Guide decision (if guide exists)
        if (guideId) {
            console.log('\nTest 5: Guide approves...');
            await client.query(
                `SELECT public.team_request_guide_decision($1, $2, $3)`,
                [requestId, guideId, 'approve']
            );
            console.log(`✓ Guide approved\n`);
            
            // Check final status
            const finalStatusResult = await client.query(
                'SELECT status FROM team_requests WHERE request_id = $1',
                [requestId]
            );
            console.log(`Final team request status: ${finalStatusResult.rows[0].status}`);
            
            const projectStatusResult = await client.query(
                'SELECT status, guide_status, visibility, ispublished FROM projects WHERE project_id = $1',
                [projectId]
            );
            const proj = projectStatusResult.rows[0];
            console.log(`Project status: ${proj.status}, guide_status: ${proj.guide_status}, visibility: ${proj.visibility}, ispublished: ${proj.ispublished}`);
        } else {
            console.log('\nTest 5: Skipped (no guide assigned - project should be auto-approved)');
            const projectStatusResult = await client.query(
                'SELECT status, visibility, ispublished FROM projects WHERE project_id = $1',
                [projectId]
            );
            const proj = projectStatusResult.rows[0];
            console.log(`Project status: ${proj.status}, visibility: ${proj.visibility}, ispublished: ${proj.ispublished}`);
        }
        
        console.log('\n=== All Tests Completed Successfully ===');
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n✗ Error:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

// Run the script
executeSQL()
    .then(() => {
        console.log('\nScript completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nScript failed:', error.message);
        process.exit(1);
    });


