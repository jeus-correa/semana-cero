"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@santotomas.cl';
    const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (exists) {
        console.log('Seed ya ejecutado: admin general existente.');
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash('Admin12345!', 12);
    await prisma.user.create({
        data: {
            email: adminEmail,
            fullName: 'Administrador General',
            role: client_1.Role.ADMIN_GENERAL,
            passwordHash
        }
    });
    console.log('Admin creado: admin@santotomas.cl / Admin12345!');
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
