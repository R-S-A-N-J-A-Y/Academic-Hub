# Guide Assignments Table Schema

## Table Description

The `guide_assignments` table tracks the assignment of faculty guides to teams. It manages the guide approval process for team projects, separate from individual project guide assignments.

## Schema

```sql
CREATE TABLE public.guide_assignments (
  assignment_id SERIAL NOT NULL,
  guide_id INTEGER NULL,
  team_id INTEGER NULL,
  assigned_on TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  status CHARACTER VARYING(20) NULL DEFAULT 'pending'::CHARACTER VARYING,
  CONSTRAINT guide_assignments_pkey PRIMARY KEY (assignment_id),
  CONSTRAINT guide_assignments_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES faculty (user_id) ON DELETE CASCADE,
  CONSTRAINT guide_assignments_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
  CONSTRAINT guide_assignments_status_check CHECK (
    (status)::text = ANY (
      ARRAY[
        'pending'::CHARACTER VARYING,
        'approved'::CHARACTER VARYING,
        'rejected'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `assignment_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `guide_id` (INTEGER): References faculty table
- `team_id` (INTEGER): References teams table
- `assigned_on` (TIMESTAMP): When assignment was made
- `status` (VARCHAR(20)): 'pending', 'approved', or 'rejected'

## Relationships

### References

- `guide_id` → `faculty.user_id`
- `team_id` → `teams.team_id`

## File Storage

This table does not handle file storage.
