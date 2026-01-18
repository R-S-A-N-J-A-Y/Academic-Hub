# Mentor/Guide Role Functionalities

## Overview

Mentors (also called Guides) are faculty members who provide guidance and oversight to student projects. They approve project assignments, review progress, and ensure academic standards are met.

## Key Functionalities

### 1. User Management

- **Faculty Profile**: Extended user profile with department and designation
- **Authentication**: Standard JWT-based login with faculty role
- **Profile Management**: Update faculty information and credentials

### 2. Project Guidance

- **Assigned Projects**: View all projects where they are the guide
- **Project Approval**: Approve or reject guide assignments
- **Progress Monitoring**: Track project status and development
- **Status Updates**: Guide project progression through workflow

### 3. Team Management

- **Team Assignments**: Guide specific teams within projects
- **Team Approval**: Approve or reject team formations
- **Member Oversight**: Monitor team composition and participation
- **Collaboration Guidance**: Provide direction for team dynamics

### 4. Review & Feedback System

- **Review Access**: View all reviews submitted by guided projects
- **Feedback Provision**: Provide feedback on project progress
- **Quality Assurance**: Ensure academic standards are maintained
- **Progress Evaluation**: Assess project development and completion

### 5. Dashboard & Analytics

- **Guide Dashboard**: View guided projects and statistics
- **Project Statistics**: Track completed, in-progress, and published projects
- **Performance Metrics**: Monitor guidance effectiveness
- **Workload Overview**: Manage multiple project assignments

## API Endpoints Used

### Authentication & Profile

- `POST /auth/login` - Faculty login
- `GET /user/me` - Get faculty profile
- `PUT /user/change-password` - Change password

### Project Guidance

- `GET /projects/guided/my` - Get guided projects
- `PUT /projects/:id/full` - Update guided project status
- `GET /projects/:id/details` - View detailed project info

### Team Guidance

- `GET /guide-assignments` - View guide assignments
- `PUT /guide-assignments/:id` - Update assignment status
- `GET /teams/:id/members` - View team members

### Faculty Operations

- `GET /faculty/:id/assignments` - Get faculty assignments
- `GET /mentors/stats/:id` - Get guidance statistics

## Frontend Components

- **FacultyDashboard.jsx**: Main dashboard for faculty
- **Mentors.jsx**: Browse available mentors
- **MentorDetail.jsx**: Detailed mentor profile and projects
- **ProjectDetail.jsx**: Project viewing with guide permissions

## Business Rules

- Guides can only modify projects they are assigned to
- Team approvals require guide consent
- Project status changes need guide approval
- Multiple projects can be guided simultaneously

## Security & Permissions

- Guides can only access assigned projects and teams
- Approval permissions for guide assignments
- Read/write access based on assignment status
- Department-based access restrictions
