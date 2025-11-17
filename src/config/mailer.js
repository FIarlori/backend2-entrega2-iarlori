import nodemailer from 'nodemailer';
import 'dotenv/config';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Variables de email no configuradas. El sistema de recuperación no funcionará.');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error configurando nodemailer:', error.message);
        console.log('💡 Verifica:');
        console.log('   1. Que el email esté correcto en .env');
        console.log('   2. Que uses App Password (no contraseña normal)');
        console.log('   3. Que tengas verificación en 2 pasos activada');
    } else {
        console.log('✅ Nodemailer configurado correctamente');
        console.log('📧 Email configurado:', process.env.EMAIL_USER);
        console.log('🔧 Estado:', success);
    }
});

export default transporter;