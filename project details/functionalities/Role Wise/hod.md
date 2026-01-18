# HOD (Head of Department) Role Functionalities

## Overview

The Head of Department (HOD) is a faculty member with additional administrative responsibilities for managing their department. They oversee faculty, projects, and department-level operations.

## Key Functionalities

### 1. User Management

- **Faculty Profile**: Standard faculty profile with HOD designation
- **Department Leadership**: Assigned as HOD for specific department
- **Authentication**: Standard faculty authentication with elevated permissions

### 2. Department Management

- **Department Overview**: Manage department information and settings
- **Faculty Supervision**: Oversee faculty members in department
- **Department Projects**: Monitor all projects within department
- **Resource Allocation**: Manage department resources and assignments

### 3. Faculty Administration

- **Faculty Assignment**: Assign faculty to department roles
- **Performance Monitoring**: Track faculty project guidance
- **Workload Management**: Balance faculty assignments and responsibilities
- **Department Coordination**: Coordinate faculty activities and schedules

### 4. Project Oversight

- **Department Projects**: View all projects in department
- **Quality Assurance**: Ensure department standards are met
- **Progress Monitoring**: Track department-wide project completion
- **Resource Support**: Provide departmental support for projects

### 5. Administrative Functions

- **Department Analytics**: View department statistics and metrics
- **Policy Implementation**: Enforce department academic policies
- **Stakeholder Communication**: Coordinate with other department heads
- **Reporting**: Generate department-level reports

## API Endpoints Used

### Department Management

- `GET /departments/:id` - Get department details
- `PUT /departments/:id` - Update department information
- `PUT /departments/:id/hod` - Assign HOD (if admin permissions)
- `GET /departments/:id/faculty` - Get department faculty

### Project Oversight

- `GET /projects/dept?dept_id=:id` - Get department projects
- `GET /projects/:id/details` - View project details
- `PUT /projects/:id/full` - Update project status (limited)

### Faculty Management

- `GET /faculty/department/:deptId` - Get department faculty
- `PUT /faculty/:id` - Update faculty information
- `GET /faculty/:id/assignments` - View faculty assignments

## Frontend Components

- **FacultyDashboard.jsx**: Enhanced dashboard with HOD features
- **Department Management**: Department-specific admin interfaces
- **Faculty Oversight**: Faculty management tools
- **Project Monitoring**: Department project tracking

## Business Rules

- HOD can only manage their assigned department
- Faculty assignments require HOD approval
- Department policies must be followed
- Project oversight within department scope

## Security & Permissions

- Department-scoped access (only their department)
- Elevated permissions for faculty management
- Project oversight within department boundaries
- Administrative functions with approval workflows
