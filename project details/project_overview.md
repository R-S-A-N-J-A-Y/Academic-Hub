# Academic Hub Project Overview

## Project Description

Academic Hub is a comprehensive web application designed for managing academic projects in an educational institution. It facilitates collaboration between students, faculty, and administrators in creating, managing, and reviewing student projects.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: React with Vite
- **Authentication**: JWT-based
- **File Storage**: External URLs (likely cloud storage like AWS S3 or similar)

## Key Features

1. **User Management**: Multi-role system (Student, Faculty, Admin, Coordinator)
2. **Project Creation**: Solo and team-based projects
3. **Team Formation**: Request-based team creation with member invitations
4. **Guide Assignment**: Faculty guides for projects
5. **Project Reviews**: File-based review submissions
6. **Department and Batch Management**: Organized by academic departments and batches
7. **Project Lifecycle**: From creation to completion with status tracking

## Database Schema Overview

The system uses 12 main tables to manage all aspects of the academic project ecosystem:

- **users**: Core user information and roles
- **batches**: Academic batches/years
- **department**: Academic departments
- **faculty**: Faculty members linked to departments
- **students**: Student profiles linked to users
- **projects**: Main project information
- **teams**: Team formations for group projects
- **team_members**: Members within teams
- **team_requests**: Team formation requests
- **team_request_members**: Members in team requests
- **guide_assignments**: Guide assignment tracking
- **project_reviews**: Review file submissions

## Application Flow

### User Registration & Authentication

1. Users register with email, password, and role
2. JWT tokens for session management
3. Role-based access control

### Project Creation

1. Students create projects (solo or team)
2. For team projects:
   - Create team request
   - Invite members
   - Members accept/reject invitations
   - Forward to guide for approval
3. Assign guide (optional during creation)
4. Guide approval required for project progression

### Project Management

1. Projects have statuses: new → pending → approved → in-progress → completed
2. Guide status: pending → approved/rejected
3. Projects can be public/private
4. Categories: mini/full projects
5. Types: solo/team

### File Handling

- Project reviews stored as file URLs
- Hosted links and paper links stored as URLs
- Files likely uploaded to external storage service
- URLs stored in database for reference

### Team Formation Process

1. Student creates team request for a project
2. Invites other students to join
3. Members respond to invitations
4. Once all members confirm, request forwarded to guide
5. Guide approves/rejects the team
6. Approved teams created in teams table

### Review Process

1. Projects can have multiple reviews
2. Reviews are numbered sequentially per project
3. Review files uploaded and URLs stored
4. Reviews track creation timestamps

## Key Relationships

- Users → Students/Faculty (role-specific tables)
- Departments have HODs (faculty)
- Students belong to batches and departments
- Projects belong to departments and batches
- Projects can have guides (faculty)
- Team projects have teams with members
- Guide assignments track guide responses
- Project reviews store file submissions

## Security & Permissions

- Role-based access (student, faculty, admin, coordinator)
- Users can only modify their own projects/teams
- Guides can approve/reject assignments
- Admins have full access

## File Storage Mechanism

- Files are not stored locally on the server
- File URLs are stored in database
- Actual files hosted on external service (S3, Cloudinary, etc.)
- Frontend handles file uploads to external service
- Backend receives URLs and stores them

## Recent Enhancements

### Edit and Create Functionality

- Enhanced project creation with additional fields (objective, category, hosted_link, visibility)
- Comprehensive project editing capabilities
- Status management and permission controls
- Integrated review upload functionality

### Project Detail Page

- Complete project information display
- Enhanced edit modal with all fields
- Permission-based access control
- Responsive design for all devices
- Integrated review management

### Implementation Details

- Full API endpoint documentation
- Frontend component architecture
- Security and permission systems
- Database schema integration

## Documentation Structure

The documentation is organized into three main categories:

### Schema Documentation (`schema/` folder)

Contains database schema information for each table:

- **users.md** - Users table schema, columns, relationships
- **batches.md** - Batches table schema
- **department.md** - Department table schema
- **faculty.md** - Faculty table schema
- **students.md** - Students table schema
- **projects.md** - Projects table schema (central table)
- **teams.md** - Teams table schema
- **team_members.md** - Team members table schema
- **team_requests.md** - Team requests table schema
- **team_request_members.md** - Team request members table schema
- **guide_assignments.md** - Guide assignments table schema
- **project_reviews.md** - Project reviews table schema
- **project_flow.md** - Combined project flow documentation for all tables

### Functionalities Documentation (`functionalities/` folder)

Contains role-based functionality implementation:

- **student.md** - Student role functionalities and capabilities
- **mentor.md** - Mentor/Guide role functionalities and responsibilities
- **hod.md** - Head of Department role functionalities and oversight
- **coordinator.md** - Coordinator/Administrator role functionalities and system management

### Additional Documentation

- **enhancements_edit_create.md** - Recent edit/create functionality enhancements
- **project_detail_enhancements.md** - Project detail page improvements
- **project_detail_implementation.md** - Implementation details and API docs

This system provides a complete academic project management solution with proper workflow management, team collaboration, and review processes.
