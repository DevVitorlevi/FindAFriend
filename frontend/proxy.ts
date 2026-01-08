import { type NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/dashboard/:path*', "/create/:path*"]
}

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/token/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const setCookieHeader = response.headers.get('set-cookie');

        const nextResponse = NextResponse.next();

        if (setCookieHeader) {
          const cookies = setCookieHeader.split(',').map(c => c.trim());
          cookies.forEach(cookie => {
            const [cookieContent] = cookie.split(';');
            const [name, value] = cookieContent.split('=');

            if (name && value) {
              nextResponse.cookies.set(name, value, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
              });
            }
          });
        }

        return nextResponse;
      }
    } catch (error) {
      console.error('Erro ao renovar token no proxy:', error);
    }
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}