# Entrega 1: Backend II - Diseño y Arquitectura Backend

## Descripción

Este proyecto implementa un **sistema de gestión de usuarios** con **CRUD completo**, **autenticación JWT** y **autorización** usando **Passport**. Incluye:

- Registro de usuarios con encriptación de contraseña (`bcrypt`).
- Login con generación de token JWT.
- Ruta protegida `/current` que devuelve los datos del usuario autenticado.
- Asociación automática de un **carrito vacío** a cada usuario.
- Población de datos relacionados (`populate`) para mostrar el carrito en las respuestas.
- Manejo robusto de errores.
- Documentación completa y colección de Postman para pruebas.

---

## Requisitos Técnicos

| Herramienta       | Versión recomendada |
|-------------------|---------------------|
| Node.js           | v20.19.5 o superior |
| MongoDB           | v7.0+ (local o servicio) |
| npm               | v10+                |
| Postman           | Última versión      |
| MongoDB Compass   | Opcional (para inspección) |

---


## Estructura del proyecto

   backend2-entrega1-iarlori/
├── docs/
│   ├── README.md                          ← Documentación
│   └── backend2-entrega1-iarlori.postman_collection.json
├── src/
│   ├── config/
│   │   ├── database.js                    ← Conexión a MongoDB
│   │   └── passport.config.js             ← Estrategia JWT
│   ├── middleware/
│   │   └── auth.js                        ← Middleware de autenticación
│   ├── models/
│   │   ├── User.js                        ← Modelo de Usuario
│   │   └── Cart.js                        ← Modelo de Carrito
│   ├── routes/
│   │   ├── users.router.js                ← CRUD de usuarios
│   │   └── sessions.router.js             ← Login y /current
│   └── utils/
│       └── jwt.js                         ← Generación y verificación de tokens
├── .env                                       ← Variables de entorno
├── .gitignore
├── app.js                                     ← Archivo principal
├── package.json
└── package-lock.json




# Endpoints de la API

## Endpoints de Usuarios (/api/users)

| Método  | URL              | Descripción      | Autenticación |
|---------|------------------|------------------|---------------|
| POST    | /api/users       | Crear usuario    | No            |
| GET     | /api/users       | Listar todos     | No            |
| GET     | /api/users/:id   | Obtener por ID   | No            |
| PUT     | /api/users/:id   | Actualizar       | No            |
| DELETE  | /api/users/:id   | Eliminar         | No            |

## Endpoints de Sesiones (/api/sessions)

| Método  | URL                    | Descripción      | Autenticación   |
|---------|------------------------|------------------|-----------------|
| POST    | /api/sessions/login    | Iniciar sesión   | No              |
| GET     | /api/sessions/current  | Usuario actual   | JWT (Bearer)    |