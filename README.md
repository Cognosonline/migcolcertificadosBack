# AVAFP Backend - Sistema de Certificados

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)](https://mongoosejs.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange.svg)](https://aws.amazon.com/s3/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Descripción

Sistema backend desarrollado en Node.js con Express para la gestión de certificados educativos integrado con **Blackboard Learn Ultra**. Permite la subida, configuración y distribución de certificados digitales con almacenamiento en AWS S3 y autenticación OAuth 2.0.

### ✨ Características principales

- 🔐 **Autenticación OAuth 2.0** con Blackboard Learn Ultra
- 📁 **Almacenamiento en AWS S3** para certificados
- 🎨 **Configuración dinámica** de posicionamiento de texto en certificados
- 👥 **Gestión de usuarios** y roles
- 📊 **Integración con calificaciones** de Blackboard
- 🔒 **Seguridad** con JWT y bcrypt
- 📤 **API RESTful** completa

## 🚀 Inicio rápido

### Prerrequisitos

- Node.js >= 18.x
- MongoDB
- Cuenta AWS con acceso a S3
- Aplicación registrada en Blackboard Learn Ultra

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url> AVAFP-back
   cd AVAFP-back
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   # Base de datos
   URI_DB=mongodb://localhost:27017/certificados
   
   # AWS S3
   MY_AWS_BUCKET_NAME=tu-bucket-certificados
   MY_AWS_BUCKET_REGION=us-east-1
   MY_AWS_PUBLIC_KEY=AKIA...
   MY_BUCK_AWS_SECRET_KEY=tu-secret-key
   
   # Blackboard OAuth
   CLIENT_ID=tu-client-id
   CLIENT_SECRET=tu-client-secret
   AUTH_CODE_URI=https://tu-blackboard.com/learn/api/public/v1/oauth2/authorizationcode
   TOKEN_INFO_URI=https://tu-blackboard.com/learn/api/public/v1/oauth2/token
   REDIRECT_URI=https://tu-dominio.com/callback
   URL=https://tu-blackboard.com/learn/api/public
   
   # Servidor
   PORT=3000
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Ejecutar en producción**
   ```bash
   npm start
   ```

## 🏗️ Arquitectura

```
AVAFP-back/
├── configs/              # Configuraciones
│   ├── db.js            # Conexión MongoDB
│   ├── configs3.js      # Configuración AWS S3
│   └── email.js         # Configuración email
├── controllers/          # Lógica de negocio
│   ├── auth.controller.js
│   ├── certificate.controllers.js
│   ├── course.controllers.js
│   └── user.controllers.js
├── models/              # Esquemas de datos
│   ├── certificate.model.js
│   └── users.model.js
├── repositories/        # Capa de acceso a datos
│   ├── certificate.repository.js
│   └── user.repository.js
├── routes/              # Definición de endpoints
│   ├── certificate.routes.js
│   ├── course.routes.js
│   ├── logs.routes.js
│   ├── oauth.routes.js
│   └── user.routes.js
├── index.js             # Punto de entrada
├── s3.js               # Servicios AWS S3
└── package.json
```

### Ejemplo de uso

**Subir certificado:**
```javascript
const formData = new FormData();
formData.append('certificado', file);
formData.append('courseId', 'COURSE_123');

fetch('/api/certificate', {
  method: 'POST',
  body: formData
});
```

**Configurar posicionamiento:**
```javascript
fetch('/api/coords', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 'COURSE_123',
    nameX: 100,
    nameY: 200,
    documentX: 100,
    documentY: 250,
    fontsize: 24,
    fontFamily: 'Arial',
    color: '#000000',
    italic: true
  })
});
```

## 🔧 Configuración

### Variables de entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `URI_DB` | URI de conexión MongoDB | ✅ |
| `MY_AWS_BUCKET_NAME` | Nombre del bucket S3 | ✅ |
| `MY_AWS_BUCKET_REGION` | Región AWS | ✅ |
| `MY_AWS_PUBLIC_KEY` | Access Key ID de AWS | ✅ |
| `MY_BUCK_AWS_SECRET_KEY` | Secret Access Key de AWS | ✅ |
| `CLIENT_ID` | Client ID de Blackboard | ✅ |
| `CLIENT_SECRET` | Client Secret de Blackboard | ✅ |
| `AUTH_CODE_URI` | URI de autorización OAuth | ✅ |
| `TOKEN_INFO_URI` | URI para obtener tokens | ✅ |
| `REDIRECT_URI` | URI de callback OAuth | ✅ |
| `URL` | URL base API Blackboard | ✅ |
| `PORT` | Puerto del servidor | ❌ |

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm start        # Ejecutar en producción
npm run dev      # Ejecutar en desarrollo con nodemon
npm run build    # No requiere build (backend)
npm test         # Ejecutar tests (no implementado)
```

## 🔒 Seguridad

- **Autenticación OAuth 2.0** con Blackboard Learn Ultra
- **Hashing de contraseñas** con bcryptjs
- **CORS configurado** para dominios específicos
- **Sesiones seguras** con express-session
- **URLs firmadas** para acceso temporal a S3

## 🔄 Changelog

### v1.0.0 (Actual)
- ✅ Integración OAuth con Blackboard Learn Ultra
- ✅ Gestión de certificados con AWS S3
- ✅ API RESTful completa
- ✅ Configuración dinámica de certificados
- ✅ Sistema de autenticación y autorización

---

**Desarrollado para la gestión de certificados educativos**