export const config = {
  matcher: '/:path*'
};

function unauthorized() {
  return new Response('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="private"' }
  });
}

export default function middleware(req) {
  const header = req.headers.get('authorization') || '';
  const user = (process.env.SITE_USER || 'Stabro').trim();
  const pass = (process.env.SITE_PASS || 'Eyergehea!').trim();

  if (!header.startsWith('Basic ')) return unauthorized();
  try {
    const raw = atob(header.slice(6));
    const i = raw.indexOf(':');
    const u = i >= 0 ? raw.slice(0, i) : raw;
    const p = i >= 0 ? raw.slice(i + 1) : '';
    if (u !== user || p !== pass) return unauthorized();
  } catch {
    return unauthorized();
  }
  return;
}
