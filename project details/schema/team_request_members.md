# Team Request Members Table Schema

## Table Description

The `team_request_members` table tracks the members invited to join a team request, including their roles and response status to the invitation.

## Schema

```sql
CREATE TABLE public.team_request_members (
  request_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role_in_request CHARACTER VARYING(20) NULL,
  reply_status CHARACTER VARYING(20) NOT NULL DEFAULT 'pending'::CHARACTER VARYING,
  replied_at TIMESTAMP WITHOUT TIME ZONE NULL,
  CONSTRAINT team_request_members_pkey PRIMARY KEY (request_id, user_id),
  CONSTRAINT team_request_members_request_id_fkey FOREIGN KEY (request_id) REFERENCES team_requests (request_id) ON DELETE CASCADE,
  CONSTRAINT team_request_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT team_request_members_reply_check CHECK (
    (reply_status)::text = ANY (
      ARRAY[
        'pending'::CHARACTER VARYING,
        'accepted'::CHARACTER VARYING,
        'rejected'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `request_id` (INTEGER NOT NULL): References team_requests (composite primary key)
- `user_id` (INTEGER NOT NULL): References users (composite primary key)
- `role_in_request` (VARCHAR(20)): Proposed role in the team
- `reply_status` (VARCHAR(20)): 'pending', 'accepted', or 'rejected'
- `replied_at` (TIMESTAMP): When the user responded

## Relationships

### References

- `request_id` → `team_requests.request_id`
- `user_id` → `users.user_id`

## File Storage

This table does not handle file storage.
