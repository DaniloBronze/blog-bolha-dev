import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Allow access to the login page
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next()
    }

    // Allow CORS for API routes
    if (pathname.startsWith('/api')) {
      const response = NextResponse.next()
      response.headers.set('Access-Control-Allow-Origin', '*')
      return response
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

        // Only allow admins on /admin routes
        if (isAdminRoute) {
          return token?.role === 'admin'
        }

        return true // Allow public routes
      }
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)

// Define which routes the middleware will run on
export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}