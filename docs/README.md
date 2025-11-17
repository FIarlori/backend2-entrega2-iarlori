# 🚀 Ecommerce Backend - Entrega Final

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema ecommerce utilizando patrones de diseño modernos, sistema de autenticación JWT, autorización por roles, gestión de carritos, proceso de compra con tickets y sistema de recuperación de contraseña.

## 🏗️ Arquitectura y Patrones Implementados

### **Patrones de Diseño**
- ✅ **Repository Pattern** - Separación entre lógica de negocio y acceso a datos
- ✅ **DAO (Data Access Object)** - Abstracción de la capa de persistencia
- ✅ **DTO (Data Transfer Object)** - Transferencia segura de datos entre capas
- ✅ **MVC (Model-View-Controller)** - Arquitectura escalable

### **Características Principales**
- 🔐 **Autenticación JWT** con Passport.js
- 👥 **Sistema de Roles** (admin/user) con autorización granular
- 🛒 **Gestión de Carritos** con validación de propiedad
- 🎫 **Sistema de Tickets** para formalizar compras
- 📧 **Recuperación de Contraseña** con enlaces expirables
- 🛡️ **Middleware de Seguridad** robusto
- 📊 **Validación de Stock** 

---

## 🛠️ Tecnologías y Versiones

| Tecnología     | Versión en tu proyecto | Uso                          |
| -------------- | ---------------------- | ---------------------------- |
| **Node.js**    | v20.19.5+              | Runtime principal            |
| **Express.js** | ^5.1.0                 | Framework web                |
| **MongoDB**    | v7.0+                  | Base de datos NoSQL          |
| **Mongoose**   | ^8.19.2                | ODM para MongoDB             |
| **JWT**        | ^9.0.2                 | Tokens de autenticación      |
| **Bcrypt**     | ^6.0.0                 | Encriptación de contraseñas  |
| **Nodemailer** | ^7.0.10                | Sistema de emails            |
| **UUID**       | ^13.0.0                | Generación de códigos únicos |


---

## 📁 Estructura del Proyecto


backend2-entrega2-iarlori/
├── docs/
│   ├── README.md                  # Documentación completa
│   └── postman_collection.json    # Colección de Postman
│
├── src/
│   ├── config/                    # Configuraciones
│   │   ├── database.js            # Conexión MongoDB
│   │   ├── passport.config.js     # Estrategia JWT (Passport)
│   │   └── mailer.js              # Configuración Nodemailer
│
│   ├── controllers/               # Controladores
│   │   ├── cart.controller.js
│   │   ├── product.controller.js
│   │   ├── purchase.controller.js
│   │   └── user.controller.js
│
│   ├── daos/
│   │   └── mongodb/               # Data Access Objects
│   │       ├── CartDAO.js
│   │       ├── ProductDAO.js
│   │       ├── TicketDAO.js
│   │       └── UserDAO.js
│
│   ├── dtos/                      # Data Transfer Objects
│   │   ├── CartDTO.js
│   │   ├── CurrentUserDTO.js
│   │   ├── ProductDTO.js
│   │   ├── TicketDTO.js
│   │   └── UserDTO.js
│
│   ├── middleware/                # Middlewares
│   │   ├── auth.js                # Autenticación JWT
│   │   ├── authorization.js       # Control de roles
│   │   └── cartAuthorization.js   # Autorización de carritos
│
│   ├── models/                    # Modelos Mongoose
│   │   ├── User.js
│   │   ├── Cart.js
│   │   ├── Product.js
│   │   └── Ticket.js
│
│   ├── repositories/              # Patrón Repository
│   │   ├── CartRepository.js
│   │   ├── ProductRepository.js
│   │   ├── TicketRepository.js
│   │   └── UserRepository.js
│
│   ├── routes/                    # Rutas
│   │   ├── carts.router.js
│   │   ├── products.router.js
│   │   ├── sessions.router.js
│   │   ├── tickets.router.js
│   │   └── users.router.js
│
│   ├── services/                  # Servicios
│   │   ├── mail.service.js
│   │   └── password.service.js
│
│   ├── utils/                     # Utilidades
│   │   ├── jwt.js
│   │   └── password.js
│
│   └── app.js                     # Aplicación principal
│
├── .env                           # Variables de entorno
├── .env.example                   # Ejemplo de variables
├── package.json
└── package-lock.json



---

## 🔐 Sistema de Autenticación y Autorización

### **Roles Implementados**
- **`user`**: Usuario regular, puede gestionar su carrito y realizar compras
- **`admin`**: Administrador, gestiona productos y usuarios

### **Estrategias de Seguridad**
- **JWT Bearer Token** para autenticación
- **Middleware de autorización** por roles
- **Validación de propiedad** para carritos
- **DTOs para evitar información sensible**

---

## 🎯 Endpoints de la API

### **🔐 Autenticación (`/api/sessions`)**

| Método | Endpoint                  | Descripción            | Autenticación  | Roles       |
| ------ | ------------------------- | ---------------------- | -------------  | ----------- |
| `POST` | `/login`                  | Iniciar sesión         | ❌             | -           |
| `GET`  | `/current`                | Usuario actual (DTO)   | ✅             | user, admin |
| `POST` | `/request-password-reset` | Solicitar recuperación | ❌             | -           |
| `POST` | `/reset-password`         | Restablecer contraseña | ❌             | -           |


### **👥 Usuarios (`/api/users`)**

| Método   | Endpoint | Descripción    | Autenticación  | Roles               |
| -------- | -------- | -------------- | -------------  | ------------------- |
| `POST`   | `/`      | Crear usuario  | ❌             | -                   |
| `GET`    | `/`      | Listar todos   | ✅             | admin               |
| `GET`    | `/:id`   | Obtener por ID | ✅             | admin, user (owner) |
| `PUT`    | `/:id`   | Actualizar     | ✅             | admin, user (owner) |
| `DELETE` | `/:id`   | Eliminar       | ✅             | admin               |


### **📦 Productos (`/api/products`)**

| Método   | Endpoint | Descripción      | Autenticación  | Roles |
| -------- | -------- | ---------------- | -------------  | ----- |
| `POST`   | `/`      | Crear producto   | ✅             | admin |
| `GET`    | `/`      | Listar productos | ❌             | -     |
| `PUT`    | `/:pid`  | Actualizar       | ✅             | admin |
| `DELETE` | `/:pid`  | Eliminar         | ✅             | admin |


### **🛒 Carritos (`/api/carts`)**

| Método | Endpoint             | Descripción      | Autenticación  | Roles        |
| ------ | -------------------- | ---------------- | -------------  | ------------ |
| `POST` | `/:cid/product/:pid` | Agregar producto | ✅             | user (owner) |
| `POST` | `/:cid/purchase`     | Finalizar compra | ✅             | user (owner) |


### **🎫 Tickets (`/api/tickets`)**

| Método | Endpoint      | Descripción    | Autenticación  | Roles       |
| ------ | ------------- | -------------- | -------------  | ----------- |
| `GET`  | `/my-tickets` | Mis tickets    | ✅             | user        |
| `GET`  | `/:code`      | Obtener ticket | ✅             | user, admin |


---
