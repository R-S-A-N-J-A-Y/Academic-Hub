# Student Role Functionalities

## Overview

Students are the primary users who create and manage academic projects. They can work on both individual and team-based projects, participate in team formation, and track their academic progress.

## Key Functionalities

### 1. User Management

- **Registration**: Create student account with batch and department assignment
- **Profile Management**: Update personal information and enrollment details
- **Password Management**: Change password securely
- **Authentication**: JWT-based login/logout

### 2. Project Management

- **Create Projects**: Start new solo or team projects with comprehensive details
- **Edit Projects**: Modify project information, status, and settings
- **Project Status Tracking**: Monitor project progress (new → pending → approved → in-progress → completed)
- **Visibility Control**: Set projects as public or private
- **Category Management**: Choose between mini and full projects

### 3. Team Participation

- **Team Project Creation**: Initiate team formation for projects
- **Member Invitation**: Send invitations to other students
- **Response Management**: Accept or reject team invitations
- **Team Leadership**: Manage team members and roles
- **Collaboration**: Work with team members on projects

### 4. Review System

- **Upload Reviews**: Submit project progress reports and files
- **Sequential Tracking**: Reviews numbered automatically per project
- **File Management**: Upload documents to external storage
- **Progress Documentation**: Maintain project development history

### 5. Dashboard & Analytics

- **Personal Dashboard**: View project statistics and progress
- **Project Statistics**: Track total, published, in-progress projects
- **Team Participation**: Monitor teams joined and roles
- **Performance Metrics**: View completion rates and achievements

## API Endpoints Used

### Authentication

- `POST /auth/register` - Student registration
- `POST /auth/login` - Student login
- `GET /user/me` - Get profile
- `PUT /user/change-password` - Change password

### Project Operations

- `GET /projects/my` - Get student's projects
- `POST /projects` - Create new project
- `PUT /projects/:id/full` - Update project
- `GET /projects/my/stats` - Get project statistics
- `POST /projects/:id/reviews` - Upload review

### Team Operations

- `POST /team-requests` - Create team request
- `PUT /team-requests/:id/members/:userId` - Respond to invitation
- `GET /teams/:id/members` - View team members

## Frontend Components

- **StudentDashboard.jsx**: Main dashboard with statistics
- **CreateProject.jsx**: Project creation form
- **EditProject.jsx**: Project editing interface
- **ProjectDetail.jsx**: Project viewing and management
- **Profile.jsx**: Profile management

## Business Rules

- Students can only edit their own projects or team leader projects
- Team invitations require responses within reasonable timeframes
- Project status changes follow approval workflows
- Reviews must be uploaded for project progression

## Security & Permissions

- Students can only access their own data and team projects
- Project visibility controls public access
- Authentication required for all operations
- Role-based access to editing functions
