# Department Table Schema

## Table Description

The `department` table stores information about academic departments within the institution. Each department can have a Head of Department (HOD) who is a faculty member.

## Schema

```sql
CREATE TABLE public.department (
  dept_id SERIAL NOT NULL,
  dept_name CHARACTER VARYING(255) NOT NULL,
  hod_id INTEGER NULL,
  CONSTRAINT department_pkey PRIMARY KEY (dept_id),
  CONSTRAINT department_hod_id_key UNIQUE (hod_id),
  CONSTRAINT department_hod_id_fkey FOREIGN KEY (hod_id) REFERENCES users (user_id)
) TABLESPACE pg_default;
```

### Columns

- `dept_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `dept_name` (VARCHAR(255) NOT NULL): Name of the department
- `hod_id` (INTEGER UNIQUE): User ID of the Head of Department (references users table)

## Relationships

### References

- `hod_id` → `users.user_id` (HOD must be a user, typically faculty)

### Referenced By

- `faculty.dept_id` → `department.dept_id` (Faculty belongs to department)
- `students.dept_id` → `department.dept_id` (Students belongs to department)
- `projects.dept_id` → `department.dept_id` (Projects belong to department)

## File Storage

This table does not handle file storage.
