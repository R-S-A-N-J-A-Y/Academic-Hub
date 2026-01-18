# Students Table Schema

## Table Description

The `students` table stores information specific to students, linking users to their batches and departments, and storing enrollment numbers. This is a role-specific extension of the users table.

## Schema

```sql
CREATE TABLE public.students (
  id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  batch_id INTEGER NOT NULL,
  enrollment_no TEXT NULL,
  dept_id INTEGER NULL,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_enrollment_no_key UNIQUE (enrollment_no),
  CONSTRAINT students_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES batches (batch_id) ON DELETE CASCADE,
  CONSTRAINT students_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES department (dept_id),
  CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

### Columns

- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `user_id` (INTEGER NOT NULL): References users table
- `batch_id` (INTEGER NOT NULL): References batches table
- `enrollment_no` (TEXT UNIQUE): Unique enrollment number for the student
- `dept_id` (INTEGER): References department table (optional)

## Relationships

### References

- `user_id` → `users.user_id` (Student must be a registered user)
- `batch_id` → `batches.batch_id` (Student belongs to a batch)
- `dept_id` → `department.dept_id` (Student belongs to a department, optional)

### Referenced By

- `team_members.user_id` → `students.user_id` (via users table)
- `team_request_members.user_id` → `students.user_id` (via users table)

## File Storage

This table does not handle file storage.
