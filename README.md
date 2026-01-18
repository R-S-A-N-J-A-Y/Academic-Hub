# Academic Hub - Project Documentation

## 📋 Project Overview

Academic Hub is a comprehensive web application designed for managing academic projects in educational institutions. It facilitates seamless collaboration between students, faculty, and administrators in creating, managing, and reviewing student projects through a structured workflow system.

### 🎯 Key Features

- **Multi-Role User Management**: Support for Students, Faculty, HODs, Coordinators, and Admins
- **Project Lifecycle Management**: Complete workflow from project creation to completion
- **Team Formation System**: Request-based team creation with member invitations and guide approval
- **Guide Assignment & Review**: Faculty mentorship with approval workflows
- **File-Based Review System**: Document submissions with external file storage
- **Department & Batch Organization**: Academic structure management
- **Role-Based Access Control**: Secure permissions based on user roles

### 🛠 Technology Stack

- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL with relational data modeling
- **Frontend**: React with Vite for modern UI development
- **Authentication**: JWT-based secure authentication system
- **File Storage**: External cloud storage integration (AWS S3 or similar)

## 📁 Documentation Structure

This documentation is organized into comprehensive sections covering all aspects of the Academic Hub system:

### 📊 Database Schema (`schema/` folder)

Detailed database design and business logic documentation:

- **[`users.md`](schema/users.md)** - Core user management and authentication
- **[`batches.md`](schema/batches.md)** - Academic batch/year organization
- **[`department.md`](schema/department.md)** - Department structure and HOD assignments
- **[`faculty.md`](schema/faculty.md)** - Faculty profiles and guide capabilities
- **[`students.md`](schema/students.md)** - Student profiles and academic tracking
- **[`projects.md`](schema/projects.md)** - Main project entity and lifecycle management
- **[`teams.md`](schema/teams.md)** - Team formations for group projects
- **[`team_members.md`](schema/team_members.md)** - Team composition and roles
- **[`team_requests.md`](schema/team_requests.md)** - Team formation request process
- **[`team_request_members.md`](schema/team_request_members.md)** - Member invitation tracking
- **[`guide_assignments.md`](schema/guide_assignments.md)** - Guide assignment workflow
- **[`project_reviews.md`](schema/project_reviews.md)** - Review submission and tracking
- **[`project_flow.md`](schema/project_flow.md)** - Combined business logic and workflows for all tables

### 👥 Role-Based Functionalities (`functionalities/Role Wise/` folder)

User-centric documentation organized by roles:

- **[`student.md`](functionalities/Role%20Wise/student.md)** - Student capabilities and project participation
- **[`mentor.md`](functionalities/Role%20Wise/mentor.md)** - Faculty mentor/guide responsibilities
- **[`hod.md`](functionalities/Role%20Wise/hod.md)** - Head of Department oversight and management
- **[`coordinator.md`](functionalities/Role%20Wise/coordinator.md)** - System coordination and administration

### 🔧 Implementation Details (`functionalities/` folder)

Technical implementation and enhancement documentation:

- **[`enhancements_edit_create.md`](functionalities/enhancements_edit_create.md)** - Project creation and editing enhancements
- **[`project_detail_enhancements.md`](functionalities/project_detail_enhancements.md)** - Project detail page improvements
- **[`project_detail_implementation.md`](functionalities/project_detail_implementation.md)** - Implementation details and API documentation

### 📋 Project Overview

- **[`project_overview.md`](project_overview.md)** - Comprehensive project overview, features, and architecture

## 🔄 Application Workflow

### User Journey
1. **Registration & Authentication**: Users register with role-based access
2. **Project Creation**: Students create solo or team projects
3. **Team Formation** (for team projects):
   - Create team request with member invitations
   - Members accept/reject invitations
   - Guide approval for team formation
4. **Guide Assignment**: Projects assigned to faculty guides
5. **Project Development**: Status tracking through lifecycle
6. **Review Submission**: File-based progress reviews
7. **Completion**: Project finalization and archiving

### Key Processes
- **Role-Based Permissions**: Different access levels for each user type
- **File Management**: External storage with URL references
- **Status Tracking**: Comprehensive project and team status management
- **Approval Workflows**: Guide and HOD approval processes

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- PostgreSQL database
- External file storage service (AWS S3, Cloudinary, etc.)

### Installation
1. Clone the repository
2. Install backend dependencies: `cd Backend && npm install`
3. Install frontend dependencies: `cd Frontend && npm install`
4. Set up PostgreSQL database with provided schema
5. Configure environment variables for JWT and file storage
6. Run database migrations and seed data
7. Start backend: `npm start` in Backend directory
8. Start frontend: `npm run dev` in Frontend directory

## 📈 Database Architecture

The system uses a relational database with 12 core tables managing:
- User management and roles
- Academic organization (departments, batches)
- Project lifecycle and team management
- Guide assignments and review processes
- File storage integration

## 🔐 Security & Permissions

- JWT-based authentication with secure token management
- Role-based access control (RBAC) system
- Permission checks for all operations
- Secure file upload and access controls
- Data validation and sanitization

## 📝 Contributing

This documentation provides comprehensive coverage of the Academic Hub system. For development contributions:

1. Review the relevant documentation sections
2. Understand the database schema and relationships
3. Follow the established workflows and permissions
4. Test changes across different user roles
5. Update documentation for any schema or functionality changes

## 📞 Support

For questions about specific features or implementation details, refer to the appropriate documentation files listed above. Each file contains detailed information about its respective component of the system.

---

*This documentation is maintained as part of the Academic Hub project. Last updated: January 2026*