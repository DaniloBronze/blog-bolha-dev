import { NextResponse } from 'next/server'
import { createAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // Check if any user exists
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Setup already completed' },
        { status: 400 }
      )
    }

    const json = await request.json()
    const { email, name, password } = json

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the first admin user
    const user = await createAdminUser(email, name, password)

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: user.email,
      name: user.name
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
