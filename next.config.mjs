/** @type {import('next').NextConfig} */
const nextConfig = {
  // playwright-core is only used by the render service; never bundle it
  serverExternalPackages: ['playwright-core', 'pg', '@sparticuz/chromium'],
  // When Supabase Storage isn't configured, answer keys rendered at build time
  // live in .library-private/ on disk. Ship them with the one route that is
  // allowed to serve them; they are still never publicly addressable.
  outputFileTracingIncludes: {
    '/worksheets/[subject]/[course]/[skill]/[slug]/answer-key/download': ['./.library-private/**/*'],
  },
};
export default nextConfig;
