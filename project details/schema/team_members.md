# Team Members Table Schema

## Table Description

The `team_members` table manages the membership of teams. It links users to teams and tracks their roles within the team (leader or member).

## Schema

```sql
CREATE TABLE public.team_members (
  team_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role_in_team CHARACTER VARYING(20) NULL,
  CONSTRAINT team_members_pkey PRIMARY KEY (team_id, user_id),
  CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
  CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT team_members_role_in_team_check CHECK (
    (role_in_team)::text = ANY (
      ARRAY[
        'leader'::CHARACTER VARYING,
        'member'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `team_id` (INTEGER NOT NULL): References teams table (composite primary key)
- `user_id` (INTEGER NOT NULL): References users table (composite primary key)
- `role_in_team` (VARCHAR(20)): 'leader' or 'member'

## Relationships

### References

- `team_id` → `teams.team_id`
- `user_id` → `users.user_id`

## File Storage

This table does not handle file storage.
