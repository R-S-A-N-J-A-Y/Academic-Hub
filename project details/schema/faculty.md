# Faculty Table Schema

## Table Description

The `faculty` table stores information specific to faculty members, linking users to their departments and storing their designations. This is a role-specific extension of the users table.

## Schema

```sql
CREATE TABLE public.faculty (
  id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  dept_id INTEGER NOT NULL,
  designation TEXT NULL,
  CONSTRAINT faculty_pkey PRIMARY KEY (id),
  CONSTRAINT faculty_user_id_key UNIQUE (user_id),
  CONSTRAINT faculty_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES department (dept_id) ON DELETE CASCADE,
  CONSTRAINT faculty_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

### Columns

- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `user_id` (INTEGER NOT NULL UNIQUE): References users table, must be unique
- `dept_id` (INTEGER NOT NULL): References department table
- `designation` (TEXT): Faculty designation/title (e.g., "Professor", "Assistant Professor")

## Relationships

### References

- `user_id` → `users.user_id` (Faculty must be a registered user)
- `dept_id` → `department.dept_id` (Faculty belongs to a department)

### Referenced By

- `projects.guide_id` → `faculty.user_id` (Project guide)
- `teams.guide_id` → `faculty.user_id` (Team guide)
- `guide_assignments.guide_id` → `faculty.user_id` (Guide assignments)

## File Storage

This table does not handle file storage.
