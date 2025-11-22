# 🗄️ GUÍA COMPLETA - AZURE SQL DATABASE + APLICACIÓN

**Proyecto:** Aplicación de Gestión Estudiantil con BD separada  
**Status:** ✅ Preparado para Azure SQL Database  
**Tiempo:** 1-2 horas para configurar completo

---

## 📋 TABLA DE CONTENIDOS

1. [Lo que cambió](#lo-que-cambió)
2. [Arquitectura](#arquitectura)
3. [Crear Azure SQL Database](#crear-azure-sql-database)
4. [Instalar y Configurar Backend](#instalar-y-configurar-backend)
5. [Conectar Aplicación al API](#conectar-aplicación-al-api)
6. [Desplegar en Azure](#desplegar-en-azure)
7. [Troubleshooting](#troubleshooting)

---

## 🔄 Lo que cambió

### ANTES (localStorage - Desarrollo)
```
Aplicación Web (HTML/CSS/JS)
        ↓
localStorage (datos locales)
```

### AHORA (Azure SQL Database - Producción)
```
Aplicación Web (HTML/CSS/JS)
        ↓
Backend API REST (Node.js + Express)
        ↓
Azure SQL Database (datos compartidos)
```

---

## 🏗️ Arquitectura

### Componentes

```
┌──────────────────────────┐
│  Aplicación Web          │
│  (index.html)            │
│  (estilos.css)           │
│  (script-con-api.js)     │
└────────────┬─────────────┘
             │ HTTP/REST
             ▼
┌──────────────────────────┐
│  Backend API             │
│  (backend-server.js)     │
│  (Node.js + Express)     │
│  (Puerto 3000)           │
└────────────┬─────────────┘
             │ SQL Queries
             ▼
┌──────────────────────────┐
│  Azure SQL Database      │
│  (Tabla: usuarios)       │
│  (Datos compartidos)     │
└──────────────────────────┘
```

### Flujo de Datos

#### 1. Registro
```
Usuario llena formulario
        ↓
JavaScript hace POST /api/auth/register
        ↓
Backend valida datos
        ↓
Inserta en Azure SQL
        ↓
Retorna usuario creado
        ↓
Frontend guarda sesión
```

#### 2. Login
```
Usuario ingresa credenciales
        ↓
JavaScript hace POST /api/auth/login
        ↓
Backend busca en SQL
        ↓
Retorna datos si existe
        ↓
Frontend carga dashboard
```

#### 3. Actualización de Datos
```
Usuario edita perfil
        ↓
JavaScript hace PUT /api/usuarios/:uuid
        ↓
Backend actualiza SQL
        ↓
Retorna datos actualizados
        ↓
Frontend refleja cambios
```

---

## 🗄️ Crear Azure SQL Database

### Paso 1: Crear Servidor SQL

1. **Ve a Azure Portal:** https://portal.azure.com
2. **Busca:** "SQL servers"
3. **Crea uno nuevo:**
   - Resource Group: `app-estudiante-rg`
   - Nombre: `app-estudiante-srv` (único)
   - Región: `West US 2` (o cerca de ti)
   - Admin username: `adminuser`
   - Admin password: `Contraseña123!` (fuerte)

### Paso 2: Crear Base de Datos

1. **En el servidor que creaste:**
2. **Clic en "Bases de datos"**
3. **"Crear base de datos":**
   - Nombre: `app_estudiante`
   - Servicio: `Free` o `Basic`
   - Clic "Crear"

### Paso 3: Configurar Firewall

1. **En servidor SQL → "Firewalls and virtual networks"**
2. **Agrega tu IP:**
   - "Add client IP" (tu computadora)
   - Guardar

### Paso 4: Obtener Credenciales

1. **En servidor SQL → "Overview"**
2. **Copiar "Server name":**
   - Ejemplo: `app-estudiante-srv.database.windows.net`

3. **Crear archivo `.env`:**
```
DB_SERVER=app-estudiante-srv.database.windows.net
DB_NAME=app_estudiante
DB_USER=adminuser@app-estudiante-srv
DB_PASSWORD=Contraseña123!
PORT=3000
NODE_ENV=development
```

---

## ⚙️ Instalar y Configurar Backend

### Paso 1: Instalación Local

```bash
# En tu carpeta del proyecto
npm install express body-parser mssql dotenv cors
```

O usa `package-backend.json`:
```bash
npm install -f package-backend.json
```

### Paso 2: Crear Archivo .env

Copia `.env.azure.example` a `.env`:
```
DB_SERVER=tu-servidor.database.windows.net
DB_NAME=app_estudiante
DB_USER=adminuser@tu-servidor
DB_PASSWORD=Tu_Contraseña_Fuerte_123!
PORT=3000
NODE_ENV=development
```

### Paso 3: Probar Backend Local

```bash
# Inicia el servidor
node backend-server.js

# Si todo funciona deberías ver:
# ✅ Conectado a Azure SQL Database
# ✅ Tabla "usuarios" verificada/creada
# ✅ Servidor corriendo en http://localhost:3000
```

### Paso 4: Probar API

**Registrar usuario:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "usuario": "juan",
    "contraseña": "123456",
    "fondo": "#3498db"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "juan",
    "contraseña": "123456"
  }'
```

**Obtener usuario:**
```bash
curl http://localhost:3000/api/usuarios/{uuid}
```

---

## 🔗 Conectar Aplicación al API

### Opción 1: Usar script-con-api.js (Recomendado)

1. **Actualiza `index.html`:**

```html
<!-- Cambiar esto: -->
<script src="script.js"></script>

<!-- Por esto: -->
<script src="script-con-api.js"></script>
```

2. **El archivo `script-con-api.js` ya tiene:**
   - Funciones para llamar al API
   - Manejo de errores
   - Sesiones con sessionStorage

### Opción 2: Modificar script.js Actual

Reemplaza las funciones localStorage por llamadas API:

```javascript
// ANTES (localStorage):
function guardarUsuario(usuario) {
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push(usuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// AHORA (API):
async function guardarUsuario(usuario) {
  const resultado = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  return await resultado.json();
}
```

### Ejemplo Completo de Registro

```javascript
// En index.html - Event listener del botón Registrar
document.getElementById('btnRegistrar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombreReg').value;
  const usuario = document.getElementById('usuarioReg').value;
  const contraseña = document.getElementById('contraseñaReg').value;
  const fondo = document.getElementById('colorPicker').value;

  // Validar
  if (!nombre || !usuario || !contraseña) {
    alert('Llena todos los campos');
    return;
  }

  // Llamar API
  const resultado = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: nombre,
      usuario: usuario,
      contraseña: contraseña,
      fondo: fondo
    })
  });

  const respuesta = await resultado.json();

  if (respuesta.success) {
    alert('¡Registro exitoso!');
    // Auto login
    sessionStorage.setItem('usuarioActual', JSON.stringify(respuesta.usuario));
    mostrarPaginaPerfil();
  } else {
    alert('Error: ' + respuesta.error);
  }
});
```

---

## 🚀 Desplegar en Azure

### Arquitectura Final de Despliegue

```
┌──────────────────────────┐
│  Azure Static Web Apps   │
│  (Aplicación web)        │
│  (HTML/CSS/JS)           │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│  Azure App Service       │
│  (Backend API)           │
│  (backend-server.js)     │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│  Azure SQL Database      │
│  (Datos)                 │
└──────────────────────────┘
```

### Paso 1: Desplegar Backend en App Service

1. **En Azure Portal → "App Services"**
2. **"Crear":**
   - Resource Group: `app-estudiante-rg`
   - Nombre: `app-estudiante-api`
   - Runtime: `Node 18 LTS`
   - Plan: `Free` o `Basic`

3. **En App Service → "Deployment center"**
   - Selecciona GitHub
   - Conecta repo
   - Branch: `main`
   - Automático

4. **Agregar variables de entorno:**
   - App Service → Configuration
   - Application settings:
     ```
     DB_SERVER=app-estudiante-srv.database.windows.net
     DB_NAME=app_estudiante
     DB_USER=adminuser@app-estudiante-srv
     DB_PASSWORD=TuContraseña123!
     ```

### Paso 2: Desplegar Frontend en Static Web Apps

1. **Actualiza `script-con-api.js`:**
```javascript
// Cambiar:
const API_URL = 'http://localhost:3000/api';

// Por:
const API_URL = 'https://app-estudiante-api.azurewebsites.net/api';
```

2. **Static Web Apps → Create:**
   - GitHub connection
   - Select repo
   - Build preset: `Custom`
   - App location: `.`
   - Output location: `.`

3. **Deploy**

### Paso 3: Verificar Conexión

```bash
# Test API
curl https://app-estudiante-api.azurewebsites.net/api/health

# Debería retornar:
# {
#   "status": "ok",
#   "database": "connected"
# }
```

---

## 📊 Estructura Final en Azure

```
Azure Portal
├── Resource Group: app-estudiante-rg
│   ├── SQL Server: app-estudiante-srv
│   │   └── Database: app_estudiante
│   ├── App Service: app-estudiante-api
│   │   └── Backend API (Node.js)
│   └── Static Web App: app-estudiante
│       └── Frontend (HTML/CSS/JS)
```

---

## 🧪 Testing

### Local
```bash
# Terminal 1: Backend
node backend-server.js

# Terminal 2: Frontend
cd .. && python -m http.server 8000

# Browser: http://localhost:8000
```

### Azure
```
Frontend: https://app-estudiante-xxx.azurestaticapps.net
API: https://app-estudiante-api.azurewebsites.net/api
Database: app-estudiante (Azure SQL)
```

---

## 🔐 Seguridad en Producción

### Cambios Recomendados

1. **Encriptación de Contraseñas:**
```javascript
// npm install bcrypt
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(contraseña, 10);
```

2. **Autenticación con JWT:**
```javascript
// npm install jsonwebtoken
const token = jwt.sign({ uuid }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

3. **Validación de Datos:**
```javascript
// npm install joi
const schema = Joi.object({
  usuario: Joi.string().alphanum().min(3).max(30).required(),
  contraseña: Joi.string().min(6).required()
});
```

4. **Rate Limiting:**
```javascript
// npm install express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

---

## 🆘 Troubleshooting

### Problema 1: "Cannot connect to database"
**Solución:**
- Verifica credenciales en `.env`
- Verifica IP en firewall de SQL
- Verifica que DB existe

### Problema 2: "CORS error"
**Solución:**
- Verifica `cors` en backend
- Frontend URL debe estar permitida

### Problema 3: "Usuario no encontrado en login"
**Solución:**
- Verifica que usuario está en base de datos
- Revisa credenciales
- Ejecuta: `SELECT * FROM usuarios`

### Problema 4: "Datos no persisten"
**Solución:**
- Verifica INSERT en backend
- Revisa SQL queries
- Verifica permisos en tabla

---

## 📚 Archivos Incluidos

| Archivo | Propósito |
|---------|----------|
| `backend-server.js` | Backend Node.js con API REST |
| `script-con-api.js` | Frontend con llamadas al API |
| `package-backend.json` | Dependencias del backend |
| `.env.azure.example` | Configuración de ejemplo |
| Esta guía | Instrucciones completas |

---

## ✅ Checklist Final

- [ ] Azure SQL Database creado
- [ ] Servidor SQL configurado
- [ ] Firewall permite mi IP
- [ ] Backend funciona localmente
- [ ] API responde a llamadas
- [ ] Frontend conecta al API
- [ ] Usuarios se guardan en BD
- [ ] Login funciona desde BD
- [ ] Datos persisten correctamente
- [ ] Despliegue en Azure completado
- [ ] Todo funciona en Azure

---

## 🎯 Próximos Pasos

1. **AHORA:** Configura Azure SQL Database
2. **Luego:** Instala backend local
3. **Después:** Conecta aplicación al API
4. **Finalmente:** Despliega todo en Azure

---

**Tu aplicación ahora está lista para usar una base de datos separada en Azure SQL Database.** 🎉

**Tiempo estimado:** 1-2 horas  
**Dificultad:** Media  
**Resultado:** Aplicación profesional con BD en la nube ☁️
