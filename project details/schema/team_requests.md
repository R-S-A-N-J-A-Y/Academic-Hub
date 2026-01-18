# Team Requests Table Schema

## Table Description

The `team_requests` table manages the process of forming teams for projects. It represents requests to create teams, going through various statuses from member collection to guide approval.

## Schema

```sql
CREATE TABLE public.team_requests (
  request_id SERIAL NOT NULL,
  project_id INTEGER NOT NULL,
  leader_id INTEGER NOT NULL,
  requested_team_name CHARACTER VARYING(255) NULL,
  status CHARACTER VARYING(30) NOT NULL DEFAULT 'waiting_for_members'::CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT team_requests_pkey PRIMARY KEY (request_id),
  CONSTRAINT team_requests_one_per_project UNIQUE (project_id),
  CONSTRAINT team_requests_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT team_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE,
  CONSTRAINT team_requests_status_check CHECK (
    (status)::text = ANY (
      ARRAY[
        'waiting_for_members'::CHARACTER VARYING,
        'members_confirmed'::CHARACTER VARYING,
        'forwarded_to_guide'::CHARACTER VARYING,
        'guide_approved'::CHARACTER VARYING,
        'guide_rejected'::CHARACTER VARYING,
        'cancelled'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `request_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `project_id` (INTEGER NOT NULL UNIQUE): References projects (one request per project)
- `leader_id` (INTEGER NOT NULL): References users (request creator/leader)
- `requested_team_name` (VARCHAR(255)): Proposed team name
- `status` (VARCHAR(30)): Request status with check constraint
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Relationships

### References

- `project_id` → `projects.project_id`
- `leader_id` → `users.user_id`

### Referenced By

- `team_request_members.request_id` → `team_requests.request_id`

## File Storage

This table does not handle file storage.
