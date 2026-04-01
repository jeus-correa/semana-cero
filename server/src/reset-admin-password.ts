/**
 * Restablece la contraseña del admin general (útil si olvidaste la clave o la BD quedó inconsistente).
 * Uso: cd server && npx ts-node src/reset-admin-password.ts
 */
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@santotomas.cl'
const NEW_PASSWORD = 'admin123'

async function main() {
  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 12)
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      fullName: 'Administrador General',
      role: Role.ADMIN_GENERAL,
      passwordHash
    }
  })
  console.log(`Listo. Correo: ${user.email}`)
  console.log(`Contraseña: ${NEW_PASSWORD}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
