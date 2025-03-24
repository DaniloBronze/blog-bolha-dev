// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }