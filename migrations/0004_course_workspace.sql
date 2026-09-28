-- ============================================================================
-- The course workspace: announcements, library assignments, submissions.
--
-- The generated-practice assignment (assignment / assignment_target) stays as
-- it is. These tables cover everything else a teacher hands out: a quiz, test,
-- reading or worksheet from the content library, or a free-form task with a
-- written response. A student is still a roster entry, never an account.
-- ============================================================================

CREATE TABLE announcement (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id           uuid NOT NULL REFERENCES class(id) ON DELETE CASCADE,
  author_account_id  uuid NOT NULL REFERENCES account(id),
  title              text NOT NULL,
  body               text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX announcement_class ON announcement (class_id, created_at DESC);

CREATE TABLE course_assignment (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id              uuid NOT NULL REFERENCES class(id) ON DELETE CASCADE,
  created_by_account_id uuid NOT NULL REFERENCES account(id),
  title                 text NOT NULL,
  instructions          text,
  -- what the student opens: a library resource, or a written task
  resource_kind         text NOT NULL CHECK (resource_kind IN ('quiz','test','reading','worksheet','task')),
  resource_id           text,            -- content id; NULL only for 'task'
  points                numeric(6,2) NOT NULL DEFAULT 100 CHECK (points > 0),
  due_at                timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT resource_named CHECK (resource_kind = 'task' OR resource_id IS NOT NULL)
);
CREATE INDEX course_assignment_class ON course_assignment (class_id, due_at);

CREATE TABLE course_submission (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_assignment_id uuid NOT NULL REFERENCES course_assignment(id) ON DELETE CASCADE,
  roster_entry_id      uuid NOT NULL REFERENCES roster_entry(id) ON DELETE CASCADE,
  answers              jsonb NOT NULL DEFAULT '{}'::jsonb,   -- question id -> choice key
  written_response     text,
  auto_score           numeric(6,2),     -- auto-graded questions, out of auto_max
  auto_max             numeric(6,2),
  score                numeric(6,2),     -- final, in assignment points; NULL = needs grading
  teacher_feedback     text,
  submitted_at         timestamptz NOT NULL DEFAULT now(),
  graded_at            timestamptz,
  UNIQUE (course_assignment_id, roster_entry_id)
);
