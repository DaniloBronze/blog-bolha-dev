import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function createAdminUser(email: string, name: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'admin'
    }
  })
}
