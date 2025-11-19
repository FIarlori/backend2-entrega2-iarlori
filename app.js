import express from 'express';
import passport from 'passport';
import sessionRouter from './src/routes/sessions.router.js';
import userRouter from './src/routes/users.router.js';
import productRouter from './src/routes/products.router.js';
import cartRouter from './src/routes/carts.router.js';
import ticketRouter from './src/routes/tickets.router.js';
import connectDB from './src/config/database.js';
import 'dotenv/config';
import './src/config/passport.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(passport.initialize());

app.get('/reset-password', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Error - Token Faltante</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 10px; padding: 30px; }
              .error { color: #dc3545; background-color: #f8d7da; padding: 15px; border-radius: 5px; }
              .info { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
              code { background: #f4f4f4; padding: 10px; border-radius: 5px; display: block; margin: 10px 0; font-family: monospace; }
              .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🔐 Restablecer Contraseña</h1>
              
              <div class="error">
                  <h3>❌ Token faltante</h3>
                  <p>No se proporcionó token en la URL. Asegúrate de usar el enlace completo del email.</p>
              </div>
              
              <div class="info">
                  <h4>📋 Instrucciones generales:</h4>
                  <p>Para probar el sistema de recuperación de contraseña:</p>
                  
                  <strong>1. Solicitar recuperación:</strong>
                  <code>POST http://localhost:8080/api/sessions/request-password-reset</code>
                  <small>Body: {"email": "tu_email@ejemplo.com"}</small>
                  
                  <strong>2. Restablecer contraseña:</strong>
                  <code>POST http://localhost:8080/api/sessions/reset-password</code>
                  <small>Body: {"token": "token_del_email", "newPassword": "nueva_contraseña"}</small>
              </div>
              
              <div style="margin-top: 20px;">
                  <a href="http://localhost:8080/api/sessions/request-password-reset" class="btn">
                      🔗 Probar solicitud de recuperación
                  </a>
                  <a href="http://localhost:8080/api/sessions/reset-password" class="btn">
                      🔗 Probar restablecimiento
                  </a>
              </div>
          </div>
      </body>
      </html>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Restablecer Contraseña - Instrucciones</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .container { border: 1px solid #ddd; border-radius: 10px; padding: 30px; }
            .success { color: #28a745; background-color: #d4edda; padding: 15px; border-radius: 5px; }
            .info { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
            code { background: #f4f4f4; padding: 10px; border-radius: 5px; display: block; margin: 10px 0; font-family: monospace; word-break: break-all; }
            .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .token-info { background: #f8f9fa; border-left: 4px solid #007bff; padding: 10px 15px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 Restablecer Contraseña</h1>
            
            <div class="success">
                <h3>✅ Token recibido correctamente</h3>
                <p>Tu token de recuperación ha sido procesado. Sigue las instrucciones para completar el proceso.</p>
            </div>
            
            <div class="token-info">
                <strong>Token recibido:</strong>
                <code>${token}</code>
            </div>
            
            <div class="info">
                <h4>📋 Para completar el proceso de recuperación:</h4>
                <p>Usa el siguiente endpoint con el método POST:</p>
                
                <strong>Endpoint:</strong>
                <code>POST http://localhost:8080/api/sessions/reset-password</code>
                
                <strong>Headers:</strong>
                <code>Content-Type: application/json</code>
                
                <strong>Cuerpo de la petición (JSON):</strong>
                <code>
{
  "token": "${token}",
  "newPassword": "tu_nueva_contraseña"
}
                </code>
                
                <strong>Ejemplo completo en Postman:</strong>
                <ul>
                    <li><strong>Método:</strong> POST</li>
                    <li><strong>URL:</strong> http://localhost:8080/api/sessions/reset-password</li>
                    <li><strong>Headers:</strong> Content-Type: application/json</li>
                    <li><strong>Body (raw JSON):</strong> 
                        <code>{"token": "${token}", "newPassword": "MiNuevaContraseña123"}</code>
                    </li>
                </ul>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> 
                <ul>
                    <li>Este token expira en 1 hora</li>
                    <li>La nueva contraseña debe tener al menos 6 caracteres</li>
                    <li>No puedes usar la misma contraseña anterior</li>
                </ul>
            </div>
            

            </div>
        </div>
        
        <script>
            // Pequeño script para facilitar el copiado del token
            document.addEventListener('DOMContentLoaded', function() {
                const tokenElement = document.querySelector('.token-info code');
                if (tokenElement) {
                    tokenElement.style.cursor = 'pointer';
                    tokenElement.title = 'Click para copiar';
                    tokenElement.addEventListener('click', function() {
                        const textArea = document.createElement('textarea');
                        textArea.value = this.textContent;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        const originalText = this.textContent;
                        this.textContent = '✅ Token copiado al portapapeles!';
                        this.style.backgroundColor = '#d4edda';
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.backgroundColor = '#f4f4f4';
                        }, 2000);
                    });
                }
            });
        </script>
    </body>
    </html>
  `);
});

app.use('/api/sessions', sessionRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/tickets', ticketRouter);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bienvenido al Ecommerce API - Entrega Final',
    version: '1.0.0',
    endpoints: {
      sessions: '/api/sessions',
      users: '/api/users',
      products: '/api/products',
      carts: '/api/carts',
      tickets: '/api/tickets'
    },
    documentation: 'Consulta el README.md para más información'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📧 Ruta de reset password: http://localhost:${PORT}/reset-password`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;