import { type NextRequest } from 'next/server'

export const config = {
  matcher: '/dashboard/:path*',
}

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return Response.redirect(new URL('/login', request.url))
  }
}