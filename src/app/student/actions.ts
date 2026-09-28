'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStudentClass } from '@/lib/auth/student';
import { clearStudentCookie } from '@/lib/auth/session';
import { submitCourseAssignment } from '@/lib/classroom/workspace';

export async function submitWorkAction(
  classId: string, assignmentId: string, answers: Record<string, string>, writing: string,
) {
  const me = await requireStudentClass(classId);
  try {
    const r = await submitCourseAssignment({
      assignmentId, classId, rosterEntryId: me.rosterEntryId,
      answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, String(v).slice(0, 500)])),
      writing: writing.slice(0, 20000),
    });
    revalidatePath(`/student/${classId}`, 'layout');
    return { saved: true as const, result: r.graded ?? undefined };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function leaveDeviceAction(form: FormData): Promise<void> {
  await clearStudentCookie(String(form.get('classId') ?? '') || undefined);
  redirect('/go');
}
