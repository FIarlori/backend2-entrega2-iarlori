import transporter from '../config/mailer.js';

 const sendResetEmail = async (email, token) => {
    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
    
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Credenciales de email no configuradas');
        }

        const mailOptions = {
            from: {
                name: 'Ecommerce Testing',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: '🔐 Recuperación de Contraseña - Ecommerce',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Recupera tu Contraseña</h1>
                    
                    <p>Hola,</p>
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            🔑 Restablecer Contraseña
                        </a>
                    </div>
                    
                    <p style="color: #666;">O copia y pega este enlace en tu navegador:</p>
                    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace;">
                        ${resetLink}
                    </p>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                        <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora.
                    </div>
                    
                    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Equipo de Ecommerce Testing<br>
                        Este es un email de prueba para el proyecto del curso.
                    </p>
                </div>
            `
        };

        console.log('📧 Enviando email de recuperación...');
        console.log('   Desde:', process.env.EMAIL_USER);
        console.log('   Para:', email);
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email enviado exitosamente!');
        console.log('   Message ID:', info.messageId);
        console.log('   El usuario recibirá el email en:', email);
        
        return info;
        
    } catch (error) {
        console.error('❌ Error enviando email:', error.message);
        
        if (error.message.includes('Credenciales')) {
            throw new Error('Sistema de email no configurado. Contacta al administrador.');
        } else if (error.message.includes('Invalid login') || error.code === 'EAUTH') {
            throw new Error('Error de autenticación con Gmail. Verifica las credenciales en el archivo .env');
        } else if (error.code === 'ECONNECTION') {
            throw new Error('Error de conexión con el servidor de email.');
        } else {
            throw new Error('Error al enviar el email: ' + error.message);
        }
    }
};

export default sendResetEmail;