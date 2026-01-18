# Teams Table Schema

## Table Description

The `teams` table stores information about project teams. For team-based projects, this table represents the approved team that will work on the project, as opposed to team_requests which are for forming teams.

## Schema

```sql
CREATE TABLE public.teams (
  team_id SERIAL NOT NULL,
  team_name CHARACTER VARYING(255) NOT NULL,
  project_id INTEGER NULL,
  guide_id INTEGER NULL,
  CONSTRAINT teams_pkey PRIMARY KEY (team_id),
  CONSTRAINT teams_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES faculty (user_id) ON DELETE SET NULL,
  CONSTRAINT teams_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

### Columns

- `team_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `team_name` (VARCHAR(255) NOT NULL): Name of the team
- `project_id` (INTEGER): References projects table
- `guide_id` (INTEGER): References faculty table (team guide)

## Relationships

### References

- `project_id` → `projects.project_id`
- `guide_id` → `faculty.user_id`

### Referenced By

- `team_members.team_id` → `teams.team_id`
- `guide_assignments.team_id` → `teams.team_id`

## File Storage

This table does not handle file storage.
