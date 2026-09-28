import { redirect } from 'next/navigation';
import { studentGrants } from './session.ts';
import { query } from '../db/client.ts';

export type StudentContext = {
  rosterEntryId: string; classId: string; name: string;
  className: string; courseName: string; classCode: string;
};

/**
 * The classes this device may open, each re-checked against the database: a
 * grant for a student who was removed, or a class that was archived, is ignored.
 */
export async function studentContexts(): Promise<StudentContext[]> {
  const grants = await studentGrants();
  if (!grants.length) return [];
  const rows = await query<StudentContext & { roster_entry_id: string; class_id: string }>(
    `SELECT e.roster_entry_id, e.class_id,
            r.first_name || COALESCE(' ' || r.last_initial || '.', '') AS name,
            c.name AS "className", co.name AS "courseName", c.class_code AS "classCode"
       FROM enrollment e
       JOIN roster_entry r ON r.id = e.roster_entry_id
       JOIN class c ON c.id = e.class_id
       JOIN course co ON co.id = c.course_id
      WHERE e.removed_at IS NULL AND r.deleted_at IS NULL AND c.archived_at IS NULL
        AND (e.roster_entry_id, e.class_id) IN (SELECT * FROM unnest($1::uuid[], $2::uuid[]))`,
    [grants.map((g) => g.rosterEntryId), grants.map((g) => g.classId)]);
  const byClass = new Map(rows.map((r) => [r.class_id, r]));
  return grants.flatMap((g) => {
    const r = byClass.get(g.classId);
    return r && r.roster_entry_id === g.rosterEntryId
      ? [{ rosterEntryId: r.roster_entry_id, classId: r.class_id, name: r.name, className: r.className, courseName: r.courseName, classCode: r.classCode }]
      : [];
  });
}

export async function requireStudent(): Promise<StudentContext[]> {
  const ctx = await studentContexts();
  if (!ctx.length) redirect('/go');
  return ctx;
}

export async function requireStudentClass(classId: string): Promise<StudentContext> {
  const ctx = (await studentContexts()).find((c) => c.classId === classId);
  if (!ctx) redirect('/go');
  return ctx;
}
