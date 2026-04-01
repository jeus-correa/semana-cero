import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@santotomas.cl'
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (exists) {
    console.log('Seed ya ejecutado: admin general existente.')
    return
  }

  const passwordHash = await bcrypt.hash('admin123', 12)

  await prisma.user.create({
    data: {
      email: adminEmail,
      fullName: 'Administrador General',
      role: Role.ADMIN_GENERAL,
      passwordHash
    }
  })

  console.log('Admin creado: admin@santotomas.cl / admin123')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
