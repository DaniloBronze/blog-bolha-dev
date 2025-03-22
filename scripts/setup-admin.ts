import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@bolhadev.com' }
    })

    if (existingUser) {
      console.log('Admin user already exists!')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123!@#', 10)
    const user = await prisma.user.create({
      data: {
        email: 'admin@bolhadev.com',
        name: 'Danilo Silva',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('Admin user created successfully:', {
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
