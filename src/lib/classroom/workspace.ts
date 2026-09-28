/**
 * The course workspace: announcements, library assignments, submissions,
 * the gradebook, calendar and to-do lists.
 *
 * Every read that a teacher triggers is scoped by teacher_account_id, and every
 * read a student triggers is scoped by their roster entry and class. The
 * generated-practice assignments (lib/classroom/assignment.ts) appear alongside
 * library assignments in lists, the gradebook and the calendar.
 */
import { query, one } from '../db/client.ts';
import {
  quizById, readingAsQuiz, gradeQuiz, resourceTitle, worksheetById,
  type Quiz, type ResourceKind,
} from '../content/catalog.ts';

// ------------------------------------------------------------------ announcements

export type Announcement = { id: string; title: string; body: string; created_at: string; author: string | null };

export async function listAnnouncements(classId: string, limit = 50): Promise<Announcement[]> {
  return query<Announcement>(
    `SELECT an.id, an.title, an.body, an.created_at, ac.display_name AS author
       FROM announcement an JOIN account ac ON ac.id = an.author_account_id
      WHERE an.class_id = $1 ORDER BY an.created_at DESC LIMIT $2`, [classId, limit]);
}

export async function createAnnouncement(teacherId: string, classId: string, title: string, body: string): Promise<void> {
  await query(
    `INSERT INTO announcement (class_id, author_account_id, title, body)
     SELECT c.id, $1, $3, $4 FROM class c WHERE c.id = $2 AND c.teacher_account_id = $1`,
    [teacherId, classId, title, body]);
}

export async function deleteAnnouncement(teacherId: string, id: string): Promise<void> {
  await query(
    `DELETE FROM announcement an USING class c
      WHERE an.id = $2 AND an.class_id = c.id AND c.teacher_account_id = $1`, [teacherId, id]);
}

// ------------------------------------------------------------------ assignments

export type CourseAssignment = {
  id: string; class_id: string; title: string; instructions: string | null;
  resource_kind: ResourceKind | 'task'; resource_id: string | null;
  points: string; due_at: string | null; created_at: string;
};

/** A row in any assignment list: library assignments and generated practice together. */
export type AssignmentRow = {
  id: string; kind: 'library' | 'practice'; title: string; due_at: string | null;
  points: number; resource_kind: string; submitted: number; students: number; needs_grading: number;
};

export async function listAssignmentRows(classId: string): Promise<AssignmentRow[]> {
  const rows = await query<{
    id: string; kind: 'library' | 'practice'; title: string; due_at: string | null; points: string;
    resource_kind: string; submitted: string; students: string; needs_grading: string;
  }>(
    `WITH roster AS (
       SELECT count(*) AS n FROM enrollment WHERE class_id = $1 AND removed_at IS NULL)
     SELECT ca.id, 'library' AS kind, ca.title, ca.due_at, ca.points::text, ca.resource_kind,
            (SELECT count(*) FROM course_submission s WHERE s.course_assignment_id = ca.id)::text AS submitted,
            (SELECT n FROM roster)::text AS students,
            (SELECT count(*) FROM course_submission s WHERE s.course_assignment_id = ca.id AND s.score IS NULL)::text AS needs_grading
       FROM course_assignment ca WHERE ca.class_id = $1
     UNION ALL
     SELECT a.id, 'practice', a.title, a.due_at, '100', 'practice',
            count(t.submitted_at)::text, count(t.*)::text, '0'
       FROM assignment a LEFT JOIN assignment_target t ON t.assignment_id = a.id
      WHERE a.class_id = $1 GROUP BY a.id
     ORDER BY due_at NULLS LAST, title`, [classId]);
  return rows.map((r) => ({
    ...r, points: Number(r.points), submitted: Number(r.submitted),
    students: Number(r.students), needs_grading: Number(r.needs_grading),
  }));
}

export async function createCourseAssignment(args: {
  teacherId: string; classId: string; title: string; instructions: string | null;
  resourceKind: ResourceKind | 'task'; resourceId: string | null; points: number; dueAt: string | null;
}): Promise<string> {
  if (args.resourceKind !== 'task') {
    if (!args.resourceId || !resourceTitle(args.resourceKind, args.resourceId)) {
      throw new Error('Pick something from the library to assign.');
    }
  }
  const row = await one<{ id: string }>(
    `INSERT INTO course_assignment
       (class_id, created_by_account_id, title, instructions, resource_kind, resource_id, points, due_at)
     SELECT c.id, $1, $3, $4, $5, $6, $7, $8 FROM class c WHERE c.id = $2 AND c.teacher_account_id = $1
     RETURNING id`,
    [args.teacherId, args.classId, args.title, args.instructions, args.resourceKind,
      args.resourceKind === 'task' ? null : args.resourceId, args.points, args.dueAt]);
  return row.id;
}

export async function getCourseAssignment(id: string, classId: string): Promise<CourseAssignment | null> {
  const rows = await query<CourseAssignment>(
    `SELECT id, class_id, title, instructions, resource_kind, resource_id, points::text, due_at, created_at
       FROM course_assignment WHERE id = $1 AND class_id = $2`, [id, classId]);
  return rows[0] ?? null;
}

export async function deleteCourseAssignment(teacherId: string, id: string): Promise<void> {
  await query(
    `DELETE FROM course_assignment ca USING class c
      WHERE ca.id = $2 AND ca.class_id = c.id AND c.teacher_account_id = $1`, [teacherId, id]);
}

/** The gradable questions behind an assignment, if it has any. */
export function assignmentQuiz(a: Pick<CourseAssignment, 'resource_kind' | 'resource_id'>): Quiz | undefined {
  if (!a.resource_id) return undefined;
  if (a.resource_kind === 'quiz' || a.resource_kind === 'test') return quizById(a.resource_id);
  if (a.resource_kind === 'reading') return readingAsQuiz(a.resource_id);
  return undefined;
}

export function assignmentHasWriting(a: Pick<CourseAssignment, 'resource_kind' | 'resource_id'>): boolean {
  if (a.resource_kind === 'task' || a.resource_kind === 'worksheet') return true;
  return !!assignmentQuiz(a)?.writing;
}

export function assignmentWorksheet(a: Pick<CourseAssignment, 'resource_kind' | 'resource_id'>) {
  return a.resource_kind === 'worksheet' && a.resource_id ? worksheetById(a.resource_id) : undefined;
}

// ------------------------------------------------------------------ submissions

export type Submission = {
  id: string; roster_entry_id: string; student_name: string;
  answers: Record<string, string>; written_response: string | null;
  auto_score: string | null; auto_max: string | null; score: string | null;
  teacher_feedback: string | null; submitted_at: string; graded_at: string | null;
};

export async function listSubmissions(assignmentId: string): Promise<Submission[]> {
  return query<Submission>(
    `SELECT s.id, s.roster_entry_id,
            r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS student_name,
            s.answers, s.written_response, s.auto_score::text, s.auto_max::text, s.score::text,
            s.teacher_feedback, s.submitted_at, s.graded_at
       FROM course_submission s JOIN roster_entry r ON r.id = s.roster_entry_id
      WHERE s.course_assignment_id = $1 ORDER BY r.first_name`, [assignmentId]);
}

export async function studentSubmission(assignmentId: string, rosterEntryId: string): Promise<Submission | null> {
  const rows = await query<Submission>(
    `SELECT s.id, s.roster_entry_id, '' AS student_name, s.answers, s.written_response,
            s.auto_score::text, s.auto_max::text, s.score::text, s.teacher_feedback, s.submitted_at, s.graded_at
       FROM course_submission s WHERE s.course_assignment_id = $1 AND s.roster_entry_id = $2`,
    [assignmentId, rosterEntryId]);
  return rows[0] ?? null;
}

/**
 * A student turns in work. Multiple-choice parts are graded here; when there is
 * nothing to read by hand, the grade is final immediately. One submission per
 * student per assignment.
 */
export async function submitCourseAssignment(args: {
  assignmentId: string; classId: string; rosterEntryId: string;
  answers: Record<string, string>; writing: string;
}) {
  const a = await getCourseAssignment(args.assignmentId, args.classId);
  if (!a) throw new Error('That assignment is not in your class.');
  const enrolled = await query(
    `SELECT 1 FROM enrollment WHERE class_id = $1 AND roster_entry_id = $2 AND removed_at IS NULL`,
    [args.classId, args.rosterEntryId]);
  if (!enrolled.length) throw new Error('You are not in this class.');
  if (await studentSubmission(a.id, args.rosterEntryId)) throw new Error('You already turned this in.');

  const quiz = assignmentQuiz(a);
  const graded = quiz ? gradeQuiz(quiz, args.answers) : null;
  const writing = args.writing.trim() || null;
  const needsReading = assignmentHasWriting(a);
  if (!graded && !writing && Object.values(args.answers).every((v) => !String(v).trim())) {
    throw new Error('Answer at least one question before submitting.');
  }

  const points = Number(a.points);
  const score = !needsReading && graded ? Math.round((points * graded.score / Math.max(1, graded.max)) * 100) / 100 : null;

  await query(
    `INSERT INTO course_submission
       (course_assignment_id, roster_entry_id, answers, written_response, auto_score, auto_max, score, graded_at)
     VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7, CASE WHEN $7::numeric IS NULL THEN NULL ELSE now() END)`,
    [a.id, args.rosterEntryId, JSON.stringify(args.answers), writing,
      graded?.score ?? null, graded?.max ?? null, score]);

  return { graded, score, points, pendingReview: score === null };
}

export async function gradeSubmission(teacherId: string, submissionId: string, score: number, feedback: string | null): Promise<void> {
  await query(
    `UPDATE course_submission s SET score = $3, teacher_feedback = $4, graded_at = now()
       FROM course_assignment ca JOIN class c ON c.id = ca.class_id
      WHERE s.id = $2 AND s.course_assignment_id = ca.id AND c.teacher_account_id = $1
        AND $3 >= 0 AND $3 <= ca.points`, [teacherId, submissionId, score, feedback]);
}

// ------------------------------------------------------------------ gradebook

export type Gradebook = {
  columns: Array<{ id: string; kind: 'library' | 'practice'; title: string; points: number; due_at: string | null }>;
  students: Array<{ id: string; name: string }>;
  cells: Map<string, { score: number | null; submitted: boolean }>;   // `${studentId}:${columnId}`
};

export async function gradebook(classId: string): Promise<Gradebook> {
  const columns = (await listAssignmentRows(classId)).map((r) => ({
    id: r.id, kind: r.kind, title: r.title, points: r.points, due_at: r.due_at,
  }));
  const students = await query<{ id: string; name: string }>(
    `SELECT r.id, r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS name
       FROM roster_entry r JOIN enrollment e ON e.roster_entry_id = r.id
      WHERE e.class_id = $1 AND e.removed_at IS NULL AND r.deleted_at IS NULL
      ORDER BY r.first_name, r.last_initial`, [classId]);

  const cells: Gradebook['cells'] = new Map();
  const lib = await query<{ roster_entry_id: string; aid: string; score: string | null }>(
    `SELECT s.roster_entry_id, s.course_assignment_id AS aid, s.score::text
       FROM course_submission s JOIN course_assignment ca ON ca.id = s.course_assignment_id
      WHERE ca.class_id = $1`, [classId]);
  for (const r of lib) cells.set(`${r.roster_entry_id}:${r.aid}`, { score: r.score === null ? null : Number(r.score), submitted: true });

  const practice = await query<{ roster_entry_id: string; aid: string; score: string | null; max_score: string | null; submitted_at: string | null }>(
    `SELECT t.roster_entry_id, t.assignment_id AS aid, t.score::text, t.max_score::text, t.submitted_at
       FROM assignment_target t JOIN assignment a ON a.id = t.assignment_id WHERE a.class_id = $1`, [classId]);
  for (const r of practice) {
    if (!r.submitted_at) continue;
    const pct = r.max_score && Number(r.max_score) > 0 ? Math.round(100 * Number(r.score) / Number(r.max_score)) : null;
    cells.set(`${r.roster_entry_id}:${r.aid}`, { score: pct, submitted: true });
  }
  return { columns, students, cells };
}

export function studentTotal(g: Gradebook, studentId: string): { earned: number; possible: number } {
  let earned = 0; let possible = 0;
  for (const c of g.columns) {
    const cell = g.cells.get(`${studentId}:${c.id}`);
    if (cell?.score !== null && cell?.score !== undefined) { earned += cell.score; possible += c.points; }
  }
  return { earned, possible };
}

// ------------------------------------------------------------------ calendar and to-do

export type DatedItem = {
  id: string; kind: 'library' | 'practice'; title: string; due_at: string;
  class_id: string; class_name: string;
};

/** Everything with a due date in a teacher's classes, or a student's, in [from, to). */
export async function datedItems(scope: { teacherId: string } | { classIds: string[] }, from: Date, to: Date): Promise<DatedItem[]> {
  const where = 'teacherId' in scope ? 'c.teacher_account_id = $1' : 'c.id = ANY($1::uuid[])';
  const arg = 'teacherId' in scope ? scope.teacherId : scope.classIds;
  return query<DatedItem>(
    `SELECT ca.id, 'library' AS kind, ca.title, ca.due_at, c.id AS class_id, c.name AS class_name
       FROM course_assignment ca JOIN class c ON c.id = ca.class_id
      WHERE ${where} AND c.archived_at IS NULL AND ca.due_at >= $2 AND ca.due_at < $3
     UNION ALL
     SELECT a.id, 'practice', a.title, a.due_at, c.id, c.name
       FROM assignment a JOIN class c ON c.id = a.class_id
      WHERE ${where} AND c.archived_at IS NULL AND a.due_at >= $2 AND a.due_at < $3
     ORDER BY due_at`, [arg, from.toISOString(), to.toISOString()]);
}

export type GradingTodo = { assignment_id: string; title: string; class_id: string; class_name: string; waiting: number };

export async function teacherGradingTodo(teacherId: string): Promise<GradingTodo[]> {
  const rows = await query<GradingTodo & { waiting: string }>(
    `SELECT ca.id AS assignment_id, ca.title, c.id AS class_id, c.name AS class_name, count(*)::text AS waiting
       FROM course_submission s
       JOIN course_assignment ca ON ca.id = s.course_assignment_id
       JOIN class c ON c.id = ca.class_id
      WHERE c.teacher_account_id = $1 AND c.archived_at IS NULL AND s.score IS NULL
      GROUP BY ca.id, c.id ORDER BY min(s.submitted_at)`, [teacherId]);
  return rows.map((r) => ({ ...r, waiting: Number(r.waiting) }));
}

// ------------------------------------------------------------------ student views

export type StudentAssignment = {
  id: string; kind: 'library' | 'practice'; title: string; due_at: string | null; points: number;
  resource_kind: string; submitted: boolean; score: number | null; graded: boolean;
};

export async function studentAssignments(classId: string, rosterEntryId: string): Promise<StudentAssignment[]> {
  const rows = await query<{
    id: string; kind: 'library' | 'practice'; title: string; due_at: string | null; points: string;
    resource_kind: string; submitted: boolean; score: string | null; graded: boolean;
  }>(
    `SELECT ca.id, 'library' AS kind, ca.title, ca.due_at, ca.points::text, ca.resource_kind,
            (s.id IS NOT NULL) AS submitted, s.score::text, (s.score IS NOT NULL) AS graded
       FROM course_assignment ca
       LEFT JOIN course_submission s ON s.course_assignment_id = ca.id AND s.roster_entry_id = $2
      WHERE ca.class_id = $1
     UNION ALL
     SELECT t.id, 'practice', a.title, a.due_at, '100', 'practice',
            (t.submitted_at IS NOT NULL),
            CASE WHEN t.max_score > 0 THEN round(100 * t.score / t.max_score)::text END,
            (t.submitted_at IS NOT NULL)
       FROM assignment_target t JOIN assignment a ON a.id = t.assignment_id
      WHERE a.class_id = $1 AND t.roster_entry_id = $2
     ORDER BY due_at NULLS LAST, title`, [classId, rosterEntryId]);
  return rows.map((r) => ({ ...r, points: Number(r.points), score: r.score === null ? null : Number(r.score) }));
}

export type StudentClassCard = { id: string; name: string; course_name: string; class_code: string; teacher: string | null };

export async function studentClassCards(classIds: string[]): Promise<StudentClassCard[]> {
  if (!classIds.length) return [];
  return query<StudentClassCard>(
    `SELECT c.id, c.name, co.name AS course_name, c.class_code, ac.display_name AS teacher
       FROM class c JOIN course co ON co.id = c.course_id JOIN account ac ON ac.id = c.teacher_account_id
      WHERE c.id = ANY($1::uuid[]) AND c.archived_at IS NULL`, [classIds]);
}

export async function classPeople(classId: string): Promise<{ teacher: string | null; students: string[] }> {
  const t = await query<{ display_name: string | null }>(
    `SELECT ac.display_name FROM class c JOIN account ac ON ac.id = c.teacher_account_id WHERE c.id = $1`, [classId]);
  const s = await query<{ name: string }>(
    `SELECT r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS name
       FROM roster_entry r JOIN enrollment e ON e.roster_entry_id = r.id
      WHERE e.class_id = $1 AND e.removed_at IS NULL AND r.deleted_at IS NULL
      ORDER BY r.first_name, r.last_initial`, [classId]);
  return { teacher: t[0]?.display_name ?? null, students: s.map((x) => x.name) };
}

export async function removeStudent(teacherId: string, classId: string, rosterEntryId: string): Promise<void> {
  await query(
    `UPDATE enrollment e SET removed_at = now() FROM class c
      WHERE e.class_id = c.id AND c.id = $2 AND c.teacher_account_id = $1 AND e.roster_entry_id = $3`,
    [teacherId, classId, rosterEntryId]);
}
