# Users Table Schema

## Table Description

The `users` table is the core table that stores information about all users in the Academic Hub system. It serves as the foundation for the entire user management system and is referenced by most other tables through foreign keys.

## Schema

```sql
CREATE TABLE public.users (
  user_id SERIAL NOT NULL,
  name CHARACTER VARYING(255) NOT NULL,
  email CHARACTER VARYING(255) NOT NULL,
  password_hash CHARACTER VARYING(255) NOT NULL,
  role CHARACTER VARYING(20) NULL,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_role_check CHECK (
    (role)::text = ANY (
      ARRAY[
        'student'::CHARACTER VARYING,
        'faculty'::CHARACTER VARYING,
        'admin'::CHARACTER VARYING,
        'coordinator'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `user_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `name` (VARCHAR(255) NOT NULL): Full name of the user
- `email` (VARCHAR(255) NOT NULL UNIQUE): Email address, must be unique
- `password_hash` (VARCHAR(255) NOT NULL): Hashed password for authentication
- `role` (VARCHAR(20)): User role with check constraint limiting to specific values

## Relationships

### Referenced By (Foreign Keys Pointing To This Table)

- `department.hod_id` → `users.user_id` (HOD of department)
- `faculty.user_id` → `users.user_id` (Faculty user profile)
- `students.user_id` → `users.user_id` (Student user profile)
- `projects.created_by` → `users.user_id` (Project creator)
- `projects.guide_id` → `users.user_id` (Project guide)
- `team_members.user_id` → `users.user_id` (Team member)
- `team_request_members.user_id` → `users.user_id` (Team request member)
- `team_requests.leader_id` → `users.user_id` (Team request leader)
- `teams.guide_id` → `users.user_id` (Team guide)
- `guide_assignments.guide_id` → `users.user_id` (Guide assignment)

## File Storage

This table does not directly handle file storage. User-related files (if any) would be handled through other mechanisms.
