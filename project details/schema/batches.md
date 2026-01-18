# Batches Table Schema

## Table Description

The `batches` table manages academic batches or year groups in the institution. Batches represent cohorts of students who are studying together, typically organized by academic year or semester.

## Schema

```sql
CREATE TABLE public.batches (
  batch_id SERIAL NOT NULL,
  batch_name CHARACTER VARYING(255) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  CONSTRAINT batches_pkey PRIMARY KEY (batch_id),
  CONSTRAINT batches_batch_name_key UNIQUE (batch_name)
) TABLESPACE pg_default;
```

### Columns

- `batch_id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `batch_name` (VARCHAR(255) NOT NULL UNIQUE): Name of the batch (e.g., "2023-2024", "Batch A")
- `start_date` (DATE): Start date of the batch
- `end_date` (DATE): End date of the batch

## Relationships

### Referenced By (Foreign Keys Pointing To This Table)

- `students.batch_id` → `batches.batch_id` (Student's batch)
- `projects.batch_id` → `batches.batch_id` (Project's batch)

## File Storage

This table does not handle file storage.
