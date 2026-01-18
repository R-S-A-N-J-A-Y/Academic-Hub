# Project Flow Documentation

This document combines the project flow information for all tables in the Academic Hub system.

## Batches Table Project Flow

## Role in Project Flow

1. **Student Organization**: Students are assigned to batches for organizational purposes
2. **Project Categorization**: Projects are associated with batches to track which batch they belong to
3. **Academic Year Management**: Helps in managing projects by academic periods

## Business Logic

- Batch names must be unique to prevent duplicates
- Optional start/end dates allow flexibility in batch definitions
- Used for filtering and organizing students and projects

## Batch Lifecycle

1. **Creation**: Admin creates batch with academic year/semester info
2. **Population**: Students assigned to batch during enrollment
3. **Usage**: Batch used for project assignments and reporting
4. **Archival**: Batch remains for historical project tracking

## Academic Organization

- Batches represent academic cohorts (e.g., "2024-2025", "Fall 2024")
- Students in same batch typically take same courses
- Projects often restricted to batch members
- Facilitates academic year-based reporting

## Usage in Application

- Admin can create/manage batches
- Students are assigned to batches during registration or profile setup
- Projects are created within specific batches
- Filtering projects/students by batch in dashboards and reports

## Department Table Project Flow

## Role in Project Flow

1. **Organizational Structure**: Departments organize faculty, students, and projects
2. **HOD Assignment**: Each department has one HOD for leadership
3. **Access Control**: Department-based permissions and filtering

## Business Logic

- HOD must be unique (one HOD per department)
- HOD references users table, ensuring they are registered users
- Departments can exist without HOD initially

## Department Hierarchy

1. **Creation**: Admin establishes academic departments
2. **Leadership**: HOD assigned from faculty members
3. **Population**: Faculty and students assigned to departments
4. **Project Oversight**: Department scope for project management

## Academic Organization

- Departments represent academic disciplines (e.g., "Computer Science", "Electrical Engineering")
- Faculty belong to specific departments
- Students may be enrolled in department courses
- Projects often aligned with department specializations

## HOD Responsibilities

- Department-level project approvals
- Faculty supervision within department
- Department-specific policy implementation
- Coordination with other department heads

## Usage in Application

- Admin creates and manages departments
- Assign HOD from faculty members
- Students and faculty assigned to departments
- Projects categorized by department
- Department-based dashboards and filtering

## Faculty Table Project Flow

## Role in Project Flow

1. **Guide Assignment**: Faculty members serve as project guides
2. **Department Leadership**: Can be assigned as HOD
3. **Project Approval**: Guides approve or reject project assignments

## Business Logic

- One user account per faculty member (unique user_id)
- Faculty must belong to a department
- CASCADE delete ensures faculty records removed if user or department deleted
- Designation is optional for flexibility

## Faculty Lifecycle

1. **Registration**: Faculty registers with user account
2. **Department Assignment**: Assigned to academic department
3. **Role Assignment**: May be assigned as department HOD
4. **Guide Responsibilities**: Can guide student projects and teams

## Guide Responsibilities

- Review and approve project proposals
- Provide guidance to student teams
- Evaluate project progress and reviews
- Approve team formations
- Oversee project completion

## Department Leadership

- HOD role for department management
- Faculty supervision and development
- Department-level project coordination
- Academic policy implementation

## Usage in Application

- Faculty registration creates both user and faculty records
- Faculty can be assigned as project guides
- Department HOD selection from faculty
- Faculty dashboards show guided projects
- Guide approval workflow for projects and teams

## Guide Assignments Table Project Flow

## Role in Project Flow

1. **Guide Assignment**: Tracks guide assignments to teams
2. **Approval Process**: Guide can approve or reject team assignments
3. **Team Guidance**: Links guides to specific teams

## Business Logic

- Assignments can be pending, approved, or rejected
- CASCADE delete removes assignments if guide or team deleted
- Timestamp tracks when assignment was made

## Assignment Lifecycle

1. **Creation**: Assignment created when team needs guide approval
2. **Review**: Guide reviews team and project details
3. **Decision**: Guide makes approve/reject decision
4. **Outcome**: Approved teams proceed; rejected teams may reassign

## Guide Evaluation Criteria

- Team composition and skills
- Project feasibility and scope
- Academic alignment with guide expertise
- Workload capacity of guide

## Status Workflow

- **pending**: Assignment created, awaiting guide decision
- **approved**: Guide approved, team can proceed
- **rejected**: Guide rejected, team formation blocked

## Faculty Workload Management

- Guides can have multiple assignments
- System tracks guide workload
- Prevents over-assignment
- Allows guide to manage capacity

## Usage in Application

- Created when teams request guide approval
- Guide can approve or reject assignments
- Status determines if team can proceed
- Guide dashboards show pending assignments

## Projects Table Project Flow

## Role in Project Flow

1. **Project Creation**: Central entity for all projects
2. **Workflow Management**: Status tracking from creation to completion
3. **Guide Assignment**: Guide approval process
4. **Team Association**: Links to teams for group projects
5. **Review Management**: Associated with project reviews

## Business Logic

- Status progression: new → pending → approved → in-progress → completed
- Guide status: pending → approved/rejected
- Solo vs team projects determine team creation requirements
- Visibility controls who can see the project
- Likes system for social features
- Conference tracking for academic achievements

## Project Lifecycle

1. **Creation**: Student creates project with basic details
2. **Guide Assignment**: Guide assigned and approval sought
3. **Team Formation**: For team projects, teams are formed
4. **Development**: Project moves to in-progress status
5. **Review Submission**: Regular reviews uploaded
6. **Completion**: Project marked as completed
7. **Publication**: Optional publication and conference submission

## Status Workflow

- **new**: Initial creation, no guide assigned
- **pending**: Guide assigned, awaiting approval
- **approved**: Guide approved, can proceed
- **in-progress**: Active development phase
- **completed**: Project finished
- **rejected**: Guide rejected the project

## Guide Approval Process

- Projects can be created with or without guide
- If guide assigned, status becomes pending
- Guide can approve or reject assignment
- Approved projects can progress
- Rejected projects may be reassigned or cancelled

## Team vs Solo Projects

- Solo projects: Single student responsibility
- Team projects: Require team formation process
- Team projects link to teams table
- Different permission models for team leaders vs members

## Usage in Application

- Project creation forms
- Project listing and detail pages
- Status updates and guide approvals
- File uploads for papers and hosted links
- Team formation for team projects
- Review submissions
- Dashboard displays

## Project Reviews Table Project Flow

## Role in Project Flow

1. **Progress Tracking**: Reviews document project progress
2. **Sequential Submission**: Numbered reviews show progression
3. **File Management**: Review documents stored externally

## Business Logic

- Unique constraint ensures sequential review numbers per project
- CASCADE delete removes reviews if project deleted
- File URLs point to external storage
- Reviews can be multiple per project

## Review Submission Process

1. **Access Check**: Verify user can upload reviews for project
2. **File Upload**: User selects and uploads file to cloud storage
3. **URL Generation**: Cloud service provides file URL
4. **Database Storage**: URL and metadata stored in database
5. **Number Assignment**: Sequential number assigned automatically

## Review Lifecycle

- **Creation**: Review uploaded during project development
- **Storage**: File stored externally, URL in database
- **Access**: Reviews viewable by authorized users
- **Retention**: Reviews kept for project history

## Progress Documentation

- Reviews show project evolution over time
- Sequential numbering indicates submission order
- Files contain detailed progress reports
- Guides use reviews to track student progress

## Permission Model

- Project creators and team members can upload
- Guides and authorized faculty can view
- Public access may be restricted
- File access controlled through URLs

## Usage in Application

- Students upload review files through frontend
- Files sent to cloud storage, URL stored in database
- Reviews displayed in project detail pages
- Review numbers show submission sequence
- Guide can view and provide feedback on reviews

## Students Table Project Flow

## Role in Project Flow

1. **Project Creation**: Students create and manage projects
2. **Team Formation**: Students participate in team projects
3. **Academic Organization**: Organized by batch and department

## Business Logic

- One user account per student
- Students must belong to a batch
- Enrollment numbers must be unique
- Department is optional (students might not be assigned to departments initially)
- CASCADE delete removes student record if user or batch deleted

## Student Lifecycle

1. **Registration**: Student registers with user account
2. **Academic Assignment**: Assigned to batch and optionally department
3. **Project Participation**: Can create solo or team projects
4. **Team Collaboration**: Can join teams or create team requests

## Project Creation Process

- Students can create projects as solo or team
- For team projects, students initiate team formation
- Students invite other students to join teams
- Students can upload project reviews and updates

## Team Participation

- Students can receive team invitations
- Students can accept or reject team invitations
- Students can leave teams (with restrictions)
- Team leaders have additional permissions

## Academic Tracking

- Batch assignment for academic year tracking
- Department assignment for specialization tracking
- Enrollment numbers for official record keeping
- Project participation history

## Usage in Application

- Student registration creates both user and student records
- Students can create solo or team projects
- Team invitations sent to other students
- Student dashboards show their projects and teams
- Batch and department-based organization

## Teams Table Project Flow

## Role in Project Flow

1. **Team Projects**: Represents approved teams for team-based projects
2. **Guide Assignment**: Teams can have dedicated guides
3. **Member Management**: Links to team members

## Business Logic

- Teams are created after team requests are approved
- One team per project (though project_id can be null initially)
- Guide can be assigned at team level
- CASCADE delete removes team if project deleted
- SET NULL for guide if guide deleted

## Team Formation Workflow

1. **Request Creation**: Student creates team request for project
2. **Member Invitation**: Team leader invites other students
3. **Response Collection**: Members accept or reject invitations
4. **Guide Approval**: Request forwarded to guide for approval
5. **Team Creation**: Approved request creates actual team
6. **Member Transfer**: Members moved from request to team

## Team Lifecycle

- **Formation**: Created from approved team request
- **Operation**: Team works on assigned project
- **Management**: Members can be added/removed by leader
- **Completion**: Team persists for project duration
- **Dissolution**: Team removed when project completes

## Guide Assignment

- Teams can have dedicated faculty guides
- Guide provides oversight and mentorship
- Guide approval required for team formation
- Guide can be changed during project lifecycle

## Member Roles

- **Leader**: Initiates team, manages members, makes decisions
- **Members**: Participate in project work
- Different permission levels for team operations

## Usage in Application

- Created after successful team request approval
- Team members added to team_members table
- Guide assignments for teams
- Team information displayed in project details
- Team-based project management

## Team Members Table Project Flow

## Role in Project Flow

1. **Team Composition**: Defines who is in each team
2. **Role Assignment**: Distinguishes leaders from members
3. **Permissions**: Role determines what actions members can take

## Business Logic

- Composite primary key ensures one record per user per team
- CASCADE delete removes membership if team or user deleted
- Role validation ensures only valid roles
- Leaders typically have more permissions than members

## Member Lifecycle

1. **Invitation**: User invited to join team request
2. **Acceptance**: User accepts invitation
3. **Team Creation**: Member transferred to actual team
4. **Participation**: Member actively participates in project
5. **Role Changes**: Leader can modify member roles
6. **Removal**: Member can be removed or leave team

## Role-Based Permissions

- **Team Leader**: Can edit project, manage members, upload reviews, change status
- **Team Member**: Can upload reviews, view project, participate in discussions
- Permission checks use this table for authorization
- UI elements shown/hidden based on member role

## Team Dynamics

- One leader per team (enforced by business logic)
- Multiple members allowed
- Leader succession if current leader leaves
- Member limits may be enforced

## Usage in Application

- Populated when teams are formed from approved team requests
- Used for permission checks in team operations
- Displayed in team member lists
- Determines who can edit projects, invite members, etc.

## Team Requests Table Project Flow

## Role in Project Flow

1. **Team Formation**: Initial step in creating teams for projects
2. **Member Invitation**: Collects member responses
3. **Guide Approval**: Final approval before team creation

## Business Logic

- One team request per project (unique constraint)
- Status progression: waiting_for_members → members_confirmed → forwarded_to_guide → guide_approved/guide_rejected
- Leader is the request creator
- CASCADE delete removes request if project or leader deleted

## Request Lifecycle

1. **Creation**: Student creates request for team project
2. **Member Collection**: Leader invites students to join
3. **Response Gathering**: Members accept/reject invitations
4. **Confirmation**: All members confirmed, status updates
5. **Guide Submission**: Request forwarded to guide for approval
6. **Guide Decision**: Guide approves or rejects team
7. **Outcome**: Approved → team created; Rejected → request cancelled

## Status Workflow

- **waiting_for_members**: Initial state, collecting member responses
- **members_confirmed**: All invited members have responded positively
- **forwarded_to_guide**: Ready for guide approval
- **guide_approved**: Guide approved, team can be created
- **guide_rejected**: Guide rejected, process ends
- **cancelled**: Request cancelled by leader or system

## Leader Responsibilities

- Create and manage team request
- Invite appropriate team members
- Monitor response status
- Make final decisions on team composition

## Guide Role

- Review team composition and project fit
- Approve or reject team formation
- Provide feedback on rejections
- Ensure academic standards are met

## Usage in Application

- Created when student initiates team formation for a project
- Members invited and their responses tracked
- Status updates as process progresses
- Successful requests lead to team creation in teams table

## Team Request Members Table Project Flow

## Role in Project Flow

1. **Invitation Tracking**: Records who was invited to join a team
2. **Response Collection**: Tracks accept/reject responses
3. **Team Formation**: Determines when all members have confirmed

## Business Logic

- Composite primary key ensures one invitation per user per request
- Reply status tracks invitation lifecycle
- Timestamp records when responses are given
- CASCADE delete removes invitations if request or user deleted

## Invitation Lifecycle

1. **Invitation Sent**: Team leader invites student
2. **Pending Response**: Member reviews invitation
3. **Response Given**: Member accepts or rejects
4. **Status Recorded**: Response stored with timestamp
5. **Workflow Triggered**: May trigger status changes in request

## Response States

- **pending**: Invitation sent, awaiting response
- **accepted**: Member agreed to join team
- **rejected**: Member declined invitation

## Team Leader Actions

- Send invitations to potential members
- Monitor response status
- Follow up with pending members
- Make decisions based on responses

## Member Experience

- Receive invitation notifications
- Review team details and project
- Make accept/reject decision
- Provide feedback if rejecting

## Usage in Application

- Created when team leader invites members
- Updated when members accept/reject invitations
- Used to determine when team request can move to next status
- Notifications sent based on reply status

## Users Table Project Flow

## Role in Project Flow

1. **Authentication**: Users log in with email/password, JWT tokens generated
2. **Authorization**: Role determines access levels (student, faculty, admin, coordinator)
3. **Profile Management**: Basic user info stored here
4. **Relationships**: Acts as parent table for role-specific information (students, faculty tables)

## Business Logic

- Email uniqueness ensures no duplicate accounts
- Role validation ensures only valid roles are assigned
- Password hashing for security
- CASCADE delete would remove all dependent records if user deleted (though typically users aren't deleted)

## User Registration Process

1. User fills registration form with email, password, role
2. System validates email uniqueness
3. Password is hashed and stored
4. Role-specific tables populated (students/faculty)
5. Welcome email sent (if implemented)

## Login Process

1. User submits email/password
2. System verifies credentials
3. JWT token generated with user info and role
4. Token returned for subsequent requests
5. Frontend stores token for authenticated requests

## Role-Based Access Control

- **Student**: Can create projects, join teams, upload reviews
- **Faculty**: Can guide projects, approve teams, review submissions
- **Admin**: Full system access, user management
- **Coordinator**: Department-level management

## Usage in Application

- Login/Register forms submit to user endpoints
- User context maintained throughout session
- Permissions checked based on role
- User info displayed in various components (dashboards, project details, etc.)

## Data Flow

1. User actions trigger API calls to user endpoints
2. Authentication middleware validates requests
