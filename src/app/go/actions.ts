'use server';

import { redirect } from 'next/navigation';
import { findClassByCode, pinHashFor, submitTarget, selfJoin } from '@/lib/classroom/student';
import { normaliseClassCode } from '@/lib/classroom/codes';
import { verifyPin, hashPin } from '@/lib/auth/password';
import { setStudentCookie, currentStudent, clearStudentCookie } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function enterCodeAction(_prev: string | null, form: FormData): Promise<string | null> {
  const code = normaliseClassCode(String(form.get('code') ?? ''));
  if (code.length < 4) return 'That code looks too short.';
  const klass = await findClassByCode(code);
  if (!klass) return 'No class with that code. Check it with your teacher.';
  redirect(`/go/${code}`);
}

export async function pickNameAction(_prev: string | null, form: FormData): Promise<string | null> {
  const code = normaliseClassCode(String(form.get('code') ?? ''));
  const rosterEntryId = String(form.get('rosterEntryId') ?? '');
  const klass = await findClassByCode(code);
  if (!klass) return 'That class is not open.';

  // The roster entry must belong to THIS class; a code is not a key to the world.
  const belongs = await query(
    `SELECT 1 FROM enrollment
      WHERE class_id = $1 AND roster_entry_id = $2 AND removed_at IS NULL`,
    [klass.id, rosterEntryId]);
  if (belongs.length === 0) return 'That name is not in this class.';

  const storedPin = await pinHashFor(rosterEntryId);
  if (storedPin) {
    const pin = String(form.get('pin') ?? '').trim();
    if (!pin) return 'Enter your PIN.';
    if (!(await verifyPin(pin, storedPin))) return 'That PIN is not right.';
  }

  await setStudentCookie(rosterEntryId, klass.id);
  redirect(`/student/${klass.id}`);
}

/** A new student adds themself: name, last initial, and a PIN they choose. */
export async function selfJoinAction(_prev: string | null, form: FormData): Promise<string | null> {
  const code = normaliseClassCode(String(form.get('code') ?? ''));
  const klass = await findClassByCode(code);
  if (!klass) return 'That class is not open.';

  const firstName = String(form.get('firstName') ?? '').trim().replace(/\s+/g, ' ');
  const lastInitial = String(form.get('lastInitial') ?? '').trim().slice(0, 1).toUpperCase() || null;
  const pin = String(form.get('pin') ?? '').trim();
  const pin2 = String(form.get('pin2') ?? '').trim();
  if (!firstName || firstName.length > 40) return 'Type your first name.';
  if (!/^\p{L}[\p{L}' -]*$/u.test(firstName)) return 'Use letters only for your name.';
  if (lastInitial && !/^\p{L}$/u.test(lastInitial)) return 'Your last initial should be one letter.';
  if (!/^\d{4,6}$/.test(pin)) return 'Your PIN needs 4 to 6 numbers.';
  if (pin !== pin2) return 'The two PINs don’t match.';

  let rosterEntryId: string;
  try {
    rosterEntryId = await selfJoin({ classId: klass.id, firstName, lastInitial, pinHash: await hashPin(pin) });
  } catch (e) {
    return (e as Error).message;
  }
  await setStudentCookie(rosterEntryId, klass.id);
  redirect(`/student/${klass.id}`);
}

export async function leaveAction(form: FormData): Promise<void> {
  const klass = await findClassByCode(String(form.get('code') ?? ''));
  await clearStudentCookie(klass?.id);
  redirect(`/go/${String(form.get('code') ?? '')}`);
}

export type SubmitState = {
  done: boolean;
  score?: number;
  maxScore?: number;
  feedback?: Array<{ itemId: string; correct: boolean; note: string | null; rationale: string | null; correctAnswer: string | null }>;
  error?: string;
};

export async function submitAction(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const targetId = String(form.get('targetId') ?? '');
  const owner = await query<{ class_id: string }>(
    `SELECT a.class_id FROM assignment_target t JOIN assignment a ON a.id = t.assignment_id WHERE t.id = $1`,
    [targetId]);
  const student = owner[0] ? await currentStudent(owner[0].class_id) : null;
  if (!student) return { done: false, error: 'Your session ended. Pick your name again.' };

  const responses: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (!key.startsWith('r:')) continue;
    // r:<itemId> for single answers, r:<itemId>:<blankIndex> for cloze
    const [, itemId, blank] = key.split(':');
    if (blank === undefined) {
      responses[itemId] = String(value);
    } else {
      const arr = (responses[itemId] as string[]) ?? [];
      arr[Number(blank)] = String(value);
      responses[itemId] = arr;
    }
  }

  try {
    const result = await submitTarget(targetId, student.rosterEntryId, responses);
    return { done: true, score: result.score, maxScore: result.maxScore, feedback: result.feedback };
  } catch (e) {
    return { done: false, error: (e as Error).message };
  }
}
