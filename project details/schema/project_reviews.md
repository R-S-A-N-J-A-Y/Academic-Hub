# Project Reviews Table Schema

## Table Description

The `project_reviews` table stores review submissions for projects. Each review consists of a file (stored as URL) and is numbered sequentially for each project.

## Schema

```sql
CREATE TABLE public.project_reviews (
  review_id SERIAL NOT NULL,
  project_id INTEGER NOT NULL,
  review_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT project_reviews_pkey PRIMARY KEY (review_id),
  CONSTRAINT unique_project_review UNIQUE (project_id, review_number),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

### Columns

- `review_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `project_id` (INTEGER NOT NULL): References projects table
- `review_number` (INTEGER NOT NULL): Sequential review number for the project
- `file_url` (TEXT NOT NULL): URL to the review file
- `created_at` (TIMESTAMP): When review was submitted

## Relationships

### References

- `project_id` → `projects.project_id`

## File Storage

- `file_url`: Stores URL to review file (typically PDF or document)
- Files are uploaded to external storage service (cloud storage)
- Frontend handles file upload, backend receives URL
- Actual files not stored in local filesystem
