"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Restablece la contraseña del admin general (útil si olvidaste la clave o la BD quedó inconsistente).
 * Uso: cd server && npx ts-node src/reset-admin-password.ts
 */
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const ADMIN_EMAIL = 'admin@santotomas.cl';
const NEW_PASSWORD = 'admin123';
async function main() {
    const passwordHash = await bcryptjs_1.default.hash(NEW_PASSWORD, 12);
    const user = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: { passwordHash },
        create: {
            email: ADMIN_EMAIL,
            fullName: 'Administrador General',
            role: client_1.Role.ADMIN_GENERAL,
            passwordHash
        }
    });
    console.log(`Listo. Correo: ${user.email}`);
    console.log(`Contraseña: ${NEW_PASSWORD}`);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
