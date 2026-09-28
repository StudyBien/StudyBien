/**
 * Where rendered PDFs live.
 *
 * Two stores on purpose:
 *
 *   PUBLIC   free worksheets. Served straight from storage with no application
 *            code in the request path. An SEO-indexed PDF endpoint that renders
 *            on request is an unmetered bill with a crawler attached; these are
 *            rendered once, at build time, and content-addressed so they can be
 *            cached forever.
 *
 *   PRIVATE  answer keys. Never publicly addressable, so the only way to get
 *            one is through the authenticated route. A gate that lives in the
 *            URL is not a gate.
 *
 * With SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set, both are Supabase
 * Storage buckets (public `library`, private `library-private`). Without them,
 * the same interface writes to the local filesystem for development.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export type Visibility = 'public' | 'private';

const BUCKET: Record<Visibility, string> = { public: 'library', private: 'library-private' };

function supabase(): { url: string; key: string } | undefined {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : undefined;
}

/** Which backend is in use, for build logs. Never includes the key. */
export function describeStorage(): string {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabase()) return `supabase storage at ${url}`;
  return `local filesystem (SUPABASE_URL ${url ? 'set' : 'missing'}, `
    + `SUPABASE_SERVICE_ROLE_KEY ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing'})`;
}

// ---------------------------------------------------------------- filesystem

const PUBLIC_ROOT = join(process.cwd(), 'public', 'library');
const PRIVATE_ROOT = join(process.cwd(), '.library-private');
const rootFor = (v: Visibility) => (v === 'public' ? PUBLIC_ROOT : PRIVATE_ROOT);

// ---------------------------------------------------------------- interface

export function publicUrlFor(key: string): string {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url
    ? `${url.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET.public}/${key}`
    : `/library/${key}`;
}

export async function put(visibility: Visibility, key: string, body: Buffer): Promise<void> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.url}/storage/v1/object/${BUCKET[visibility]}/${key}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${sb.key}`, apikey: sb.key,
        'content-type': 'application/pdf', 'x-upsert': 'true',
        // content-addressed keys: the bytes behind a key never change
        'cache-control': visibility === 'public' ? 'public, max-age=31536000, immutable' : 'no-store',
      },
      body: new Uint8Array(body),
    });
    if (!res.ok) throw new Error(`storage put ${visibility}/${key}: ${res.status} ${await res.text()}`);
    return;
  }
  const path = join(rootFor(visibility), key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
}

export async function get(visibility: Visibility, key: string): Promise<Buffer> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.url}/storage/v1/object/${BUCKET[visibility]}/${key}`, {
      headers: { authorization: `Bearer ${sb.key}`, apikey: sb.key },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`storage get ${visibility}/${key}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(join(rootFor(visibility), key));
}

export async function exists(visibility: Visibility, key: string): Promise<boolean> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.url}/storage/v1/object/info/${BUCKET[visibility]}/${key}`, {
      headers: { authorization: `Bearer ${sb.key}`, apikey: sb.key },
      cache: 'no-store',
    });
    return res.ok;
  }
  try {
    await access(join(rootFor(visibility), key));
    return true;
  } catch {
    return false;
  }
}
