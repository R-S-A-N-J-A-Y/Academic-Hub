# Projects Table Schema

## Table Description

The `projects` table is the central table that stores all information about academic projects. It contains project details, status, relationships to creators, guides, departments, and batches, and includes file-related fields like hosted links and paper links.

## Schema

```sql
CREATE TABLE public.projects (
  project_id SERIAL NOT NULL,
  title CHARACTER VARYING(255) NOT NULL,
  abstract TEXT NULL,
  type CHARACTER VARYING(20) NULL,
  status CHARACTER VARYING(20) NULL DEFAULT 'pending'::CHARACTER VARYING,
  created_by INTEGER NULL,
  batch_id INTEGER NULL,
  dept_id INTEGER NULL,
  guide_id INTEGER NULL,
  guide_status CHARACTER VARYING(20) NULL DEFAULT 'pending'::CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  objective TEXT NULL,
  category CHARACTER VARYING(20) NULL,
  hosted_link TEXT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  visibility CHARACTER VARYING(20) NOT NULL DEFAULT 'public'::CHARACTER VARYING,
  ispublished BOOLEAN NOT NULL DEFAULT FALSE,
  paper_link TEXT NULL,
  conference_name CHARACTER VARYING(255) NULL,
  conference_year INTEGER NULL,
  conference_status CHARACTER VARYING(50) NULL,
  CONSTRAINT projects_pkey PRIMARY KEY (project_id),
  CONSTRAINT projects_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES batches (batch_id) ON DELETE SET NULL,
  CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT projects_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES department (dept_id) ON DELETE SET NULL,
  CONSTRAINT projects_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES faculty (user_id) ON DELETE SET NULL,
  CONSTRAINT projects_visibility_check CHECK (
    (visibility)::text = ANY (
      ARRAY[
        'public'::CHARACTER VARYING,
        'private'::CHARACTER VARYING
      ]::text[]
    )
  ),
  CONSTRAINT projects_guide_status_check CHECK (
    (guide_status)::text = ANY (
      ARRAY[
        'pending'::CHARACTER VARYING,
        'approved'::CHARACTER VARYING,
        'rejected'::CHARACTER VARYING
      ]::text[]
    )
  ),
  CONSTRAINT projects_category_check CHECK (
    (category)::text = ANY (
      ARRAY[
        'mini'::CHARACTER VARYING,
        'full'::CHARACTER VARYING
      ]::text[]
    )
  ),
  CONSTRAINT projects_conference_status_check CHECK (
    (conference_status)::text = ANY (
      ARRAY[
        'participation'::CHARACTER VARYING,
        'prize'::CHARACTER VARYING
      ]::text[]
    )
  ),
  CONSTRAINT projects_status_check CHECK (
    (status)::text = ANY (
      ARRAY[
        'pending'::CHARACTER VARYING,
        'approved'::CHARACTER VARYING,
        'rejected'::CHARACTER VARYING,
        'in-progress'::CHARACTER VARYING,
        'completed'::CHARACTER VARYING,
        'new'::CHARACTER VARYING
      ]::text[]
    )
  ),
  CONSTRAINT projects_type_check CHECK (
    (type)::text = ANY (
      ARRAY[
        'solo'::CHARACTER VARYING,
        'team'::CHARACTER VARYING
      ]::text[]
    )
  )
) TABLESPACE pg_default;
```

### Columns

- `project_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `title` (VARCHAR(255) NOT NULL): Project title
- `abstract` (TEXT): Project abstract/description
- `type` (VARCHAR(20)): 'solo' or 'team'
- `status` (VARCHAR(20)): Project status with check constraint
- `created_by` (INTEGER): References users (project creator)
- `batch_id` (INTEGER): References batches
- `dept_id` (INTEGER): References department
- `guide_id` (INTEGER): References faculty (project guide)
- `guide_status` (VARCHAR(20)): Guide approval status
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp
- `objective` (TEXT): Project objectives
- `category` (VARCHAR(20)): 'mini' or 'full' project
- `hosted_link` (TEXT): URL to hosted project/demo
- `likes` (INTEGER): Number of likes
- `visibility` (VARCHAR(20)): 'public' or 'private'
- `ispublished` (BOOLEAN): Whether project is published
- `paper_link` (TEXT): URL to research paper
- `conference_name` (VARCHAR(255)): Conference name
- `conference_year` (INTEGER): Conference year
- `conference_status` (VARCHAR(50)): 'participation' or 'prize'

## Relationships

### References

- `created_by` → `users.user_id`
- `batch_id` → `batches.batch_id`
- `dept_id` → `department.dept_id`
- `guide_id` → `faculty.user_id`

### Referenced By

- `teams.project_id` → `projects.project_id`
- `team_requests.project_id` → `projects.project_id`
- `project_reviews.project_id` → `projects.project_id`
- `guide_assignments` (references projects indirectly)

## File Storage

- `hosted_link`: URL to hosted project/demo (external hosting)
- `paper_link`: URL to research paper/document (external storage)
- Files are not stored locally; URLs point to external services
- Actual file uploads handled by frontend to cloud storage
