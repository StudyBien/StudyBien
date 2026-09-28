'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { createClass } from '@/lib/classroom/teacher';
import {
  createAnnouncement, deleteAnnouncement, createCourseAssignment, deleteCourseAssignment,
  gradeSubmission, removeStudent,
} from '@/lib/classroom/workspace';
import { LEVEL_IDS } from '@/lib/content/levels';
import type { ResourceKind } from '@/lib/content/catalog';

export async function createCourseAction(_prev: string | null, form: FormData): Promise<string | null> {
  const teacherId = await requireTeacher();
  const name = String(form.get('name') ?? '').trim();
  const level = String(form.get('level') ?? '');
  if (!name) return 'Give your course a name.';
  if (!LEVEL_IDS.includes(level as never)) return 'Pick a level.';
  const id = await createClass(teacherId, name.slice(0, 120), level);
  redirect(`/teacher/${id}`);
}

export async function postAnnouncementAction(_prev: string | null, form: FormData): Promise<string | null> {
  const teacherId = await requireTeacher();
  const classId = String(form.get('classId') ?? '');
  await requireOwnedClass(teacherId, classId);
  const title = String(form.get('title') ?? '').trim();
  const body = String(form.get('body') ?? '').trim();
  if (!title || !body) return 'An announcement needs a title and a message.';
  await createAnnouncement(teacherId, classId, title.slice(0, 200), body.slice(0, 5000));
  revalidatePath(`/teacher/${classId}`, 'layout');
  return null;
}

export async function deleteAnnouncementAction(form: FormData): Promise<void> {
  const teacherId = await requireTeacher();
  await deleteAnnouncement(teacherId, String(form.get('id')));
  revalidatePath(`/teacher/${String(form.get('classId'))}`, 'layout');
}

export async function createCourseAssignmentAction(_prev: string | null, form: FormData): Promise<string | null> {
  const teacherId = await requireTeacher();
  const classId = String(form.get('classId') ?? '');
  await requireOwnedClass(teacherId, classId);
  const kind = String(form.get('kind') ?? 'task') as ResourceKind | 'task';
  const resourceId = String(form.get('resourceId') ?? '') || null;
  const due = String(form.get('dueAt') ?? '').trim();
  const points = Number(form.get('points') ?? 100);
  const title = String(form.get('title') ?? '').trim();
  if (!['quiz', 'test', 'reading', 'worksheet', 'task'].includes(kind)) return 'Pick an assignment type.';
  if (!title) return 'Give the assignment a title.';
  if (!Number.isFinite(points) || points <= 0 || points > 1000) return 'Points must be between 1 and 1000.';
  try {
    await createCourseAssignment({
      teacherId, classId, title: title.slice(0, 200),
      instructions: String(form.get('instructions') ?? '').trim().slice(0, 5000) || null,
      resourceKind: kind, resourceId, points,
      dueAt: due ? new Date(due).toISOString() : null,
    });
  } catch (e) {
    return (e as Error).message;
  }
  revalidatePath(`/teacher/${classId}`, 'layout');
  redirect(`/teacher/${classId}/assignments`);
}

export async function deleteCourseAssignmentAction(form: FormData): Promise<void> {
  const teacherId = await requireTeacher();
  const classId = String(form.get('classId'));
  await deleteCourseAssignment(teacherId, String(form.get('id')));
  revalidatePath(`/teacher/${classId}`, 'layout');
  redirect(`/teacher/${classId}/assignments`);
}

export async function gradeAction(form: FormData): Promise<void> {
  const teacherId = await requireTeacher();
  const score = Number(form.get('score'));
  if (!Number.isFinite(score)) return;
  await gradeSubmission(teacherId, String(form.get('submissionId')), score,
    String(form.get('feedback') ?? '').trim().slice(0, 5000) || null);
  revalidatePath(String(form.get('path') ?? '/teacher'));
}

export async function removeStudentAction(form: FormData): Promise<void> {
  const teacherId = await requireTeacher();
  const classId = String(form.get('classId'));
  await removeStudent(teacherId, classId, String(form.get('rosterEntryId')));
  revalidatePath(`/teacher/${classId}`, 'layout');
}
