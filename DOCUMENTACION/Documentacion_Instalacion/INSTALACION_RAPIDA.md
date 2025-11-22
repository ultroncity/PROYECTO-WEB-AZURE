# 🚀 GUÍA RÁPIDA: INSTALAR Y PROBAR BACKEND CON AZURE SQL

## 📋 Requisitos Previos

- **Node.js 14+** instalado en tu PC
- **Azure SQL Database** creada y funcionando
- **Credenciales de Azure SQL** (servidor, base de datos, usuario, contraseña)

---

## 🔧 PASO 1: Instalar Dependencias (5 minutos)

### 1.1 Abre PowerShell en la carpeta del proyecto

```powershell
# Navega a tu proyecto
cd "c:\Users\Omar Gomez\Universidad\Programacion Web\Proyecto Final programacion web\Proyecto Referencia"
```

### 1.2 Instala las dependencias necesarias

```powershell
# Opción A: Instalar cada paquete manualmente
npm install express body-parser mssql dotenv cors uuid

# Opción B: Instalar desde package-backend.json (si existe)
npm install -f package-backend.json

# Opción C: Instalar versiones específicas (recomendado)
npm install express@4.18.2 body-parser@1.20.2 mssql@9.1.1 dotenv@16.3.1 cors@2.8.5 uuid@9.0.0
```

### 1.3 Instala nodemon (para desarrollo)

```powershell
npm install --save-dev nodemon@3.0.1
```

**Verificación:**
```powershell
npm list
# Deberías ver: express, body-parser, mssql, dotenv, cors, uuid
```

---

## 🔐 PASO 2: Configurar Variables de Entorno (5 minutos)

### 2.1 Crea el archivo `.env` en la carpeta del proyecto

```
# En la carpeta: C:\Users\Omar Gomez\Universidad\...\Proyecto Referencia\.env
```

### 2.2 Copia esta configuración (reemplaza con TUS datos de Azure)

```plaintext
# AZURE SQL DATABASE CONFIGURATION

# Nombre del servidor SQL (sin https://)
# Ejemplo: myserver.database.windows.net
DB_SERVER=tu-servidor.database.windows.net

# Nombre de la base de datos que creaste
DB_NAME=tu_base_de_datos

# Usuario SQL (usuario de administrador que creaste)
DB_USER=tuusuario@tu-servidor

# Contraseña del usuario SQL
DB_PASSWORD=TuContraseñaSegura123!

# Puerto del servidor local
PORT=3000

# Ambiente (development o production)
NODE_ENV=development
```

### 2.3 ¿Cómo obtener tus credenciales de Azure?

1. Ve a **Azure Portal** → **SQL Databases**
2. Selecciona tu base de datos
3. En "Overview" verás:
   - **Server name**: El valor para `DB_SERVER`
   - **Resource group**: Para verificar ubicación
4. En "Server" (hacer clic en el nombre del servidor):
   - **Server name**: Confirmar `DB_SERVER`
   - **Admin username**: El valor para `DB_USER`
   - La contraseña es la que ingresaste al crear el servidor

**Ejemplo completo:**
```plaintext
DB_SERVER=app-estudiante-srv.database.windows.net
DB_NAME=app_estudiante_db
DB_USER=adminuser@app-estudiante-srv
DB_PASSWORD=MiContraseña123!@#
PORT=3000
NODE_ENV=development
```

---

## 📊 PASO 3: Crear Tablas en Azure SQL (5 minutos)

### 3.1 Abre el Query Editor en Azure Portal

1. Azure Portal → SQL Databases → Tu base de datos
2. Query editor (está en la izquierda)
3. Inicia sesión con tu usuario admin

### 3.2 Copia y ejecuta `setup-database.sql`

1. Abre el archivo `setup-database.sql` de tu proyecto
2. Copia TODO el contenido
3. En Query Editor, pega y ejecuta (Ctrl+Enter)
4. Deberías ver: ✅ **Operación exitosa**

---

## ✅ PASO 4: Probar Backend Localmente (10 minutos)

### 4.1 Inicia el servidor

```powershell
# En PowerShell, en la carpeta del proyecto:

# Opción A: Ejecutar directo
node backend-server-v2.js

# Opción B: Usar nodemon (se reinicia automáticamente)
npx nodemon backend-server-v2.js
```

**Si funciona, deberías ver:**
```
═══════════════════════════════════════════════════════════════
🚀 SERVIDOR BACKEND ACTIVO
═══════════════════════════════════════════════════════════════
📡 Puerto: 3000
🌐 Base de datos: app_estudiante_db
🔌 Servidor: app-estudiante-srv.database.windows.net

ENDPOINTS DISPONIBLES:
  POST   http://localhost:3000/api/auth/register
  POST   http://localhost:3000/api/auth/login
  GET    http://localhost:3000/api/usuarios/:uuid
  PUT    http://localhost:3000/api/usuarios/:uuid
  DELETE http://localhost:3000/api/usuarios/:uuid
  GET    http://localhost:3000/api/health
```

### 4.2 Prueba el endpoint de salud (en otra PowerShell)

```powershell
# Prueba que el servidor está activo
curl http://localhost:3000/api/health

# Deberías ver una respuesta JSON:
# {"éxito":true,"mensaje":"Servidor funcionando correctamente","datos":{"status":"online",...}}
```

---

## 🧪 PASO 5: Probar Endpoints (15 minutos)

### 5.1 Registrar un nuevo usuario

```powershell
$body = @{
    nombre = "Juan Pérez"
    usuario = "juan123"
    contraseña = "123456789"
    fondo = "#3498db"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Respuesta esperada:**
```json
{
  "éxito": true,
  "mensaje": "Usuario registrado exitosamente",
  "datos": {
    "uuid": "12345-abcde-...",
    "nombre": "Juan Pérez",
    "usuario": "juan123",
    "fondo": "#3498db"
  }
}
```

### 5.2 Iniciar sesión

```powershell
$body = @{
    usuario = "juan123"
    contraseña = "123456789"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Copia el `uuid` de la respuesta para los siguientes pasos**

### 5.3 Obtener datos del usuario

```powershell
# Reemplaza UUID con el que obtuviste en el login
$uuid = "tu-uuid-aqui"

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/$uuid" `
    -Method GET

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### 5.4 Actualizar usuario

```powershell
$uuid = "tu-uuid-aqui"

$body = @{
    nombre = "Juan Pérez Actualizado"
    fondo = "#e74c3c"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/$uuid" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### 5.5 Eliminar usuario

```powershell
$uuid = "tu-uuid-aqui"

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/$uuid" `
    -Method DELETE

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 🔗 PASO 6: Conectar Frontend al Backend (10 minutos)

### 6.1 Actualiza `index.html`

Busca esta línea:
```html
<script src="script.js"></script>
```

Reemplázala con:
```html
<script src="script-con-api.js"></script>
```

### 6.2 Configura la URL del API en `script-con-api.js`

Abre `script-con-api.js` y busca:
```javascript
const API_URL = 'http://localhost:3000';
```

Asegúrate de que esté correcto:
- **Local**: `http://localhost:3000` ✅
- **Azure**: `https://tu-app-backend.azurewebsites.net` (después de desplegar)

### 6.3 Prueba el frontend

1. Abre PowerShell en la carpeta del proyecto
2. Inicia un servidor local:
   ```powershell
   python -m http.server 8000
   # O si tienes Node.js:
   npx http-server -p 8000
   ```
3. Abre: `http://localhost:8000`
4. Prueba Registro → Login → Cambios de Perfil

**Verifica en Azure que los datos se guardan:**
- Query Editor → `SELECT * FROM usuarios;`

---

## ❓ SOLUCIONAR PROBLEMAS

### Error: `Cannot find module 'mssql'`
```powershell
npm install mssql
```

### Error: `ECONNREFUSED` (No puede conectar a BD)
- ✅ Verifica que `.env` tiene las credenciales correctas
- ✅ Verifica que Azure SQL está encendido (no pausado)
- ✅ Verifica firewall: Azure Portal → SQL Server → Firewalls → Agrega tu IP

### Error: `Login failed for user`
- ✅ Usuario o contraseña incorrectos
- ✅ El usuario no tiene permisos en la BD
- ✅ Verifica el formato: `usuario@servidor` (no solo `usuario`)

### Error: `Network timeout`
- ✅ Azure SQL puede estar pausado o con problemas
- ✅ Verifica conectividad: Test en Query Editor de Azure
- ✅ Verifica ubicación: ¿Estás en la misma región?

### Error: `CORS error` en el frontend
- ✅ Actualiza CORS en `backend-server-v2.js`:
  ```javascript
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://tu-app.azurestaticapps.net'  // Agrega tu URL
  ]
  ```

---

## ✨ CHECKLIST DE VERIFICACIÓN

```
PRE-INSTALACIÓN:
☐ Node.js 14+ instalado
☐ Azure SQL Database creada
☐ Credenciales disponibles

INSTALACIÓN:
☐ npm install completó sin errores
☐ Archivo .env creado y completado
☐ setup-database.sql ejecutado en Azure

SERVIDOR:
☐ node backend-server-v2.js inicia sin errores
☐ /api/health responde correctamente
☐ Puedo registrar usuario
☐ Puedo iniciar sesión
☐ Datos aparecen en Query Editor

FRONTEND:
☐ index.html usa script-con-api.js
☐ API_URL es correcto
☐ Registro funciona
☐ Login funciona
☐ Datos persisten en Azure SQL
```

---

## 🎉 ¡LISTO!

Tu aplicación está conectada a Azure SQL Database. Ahora puedes:

1. **Compartir la aplicación** con otros usuarios
2. **Persistencia real**: Los datos se guardan en Azure
3. **Desplegar a producción**: Sigue GUIA_AZURE_SQL_DATABASE.md

---

## 📞 PRÓXIMOS PASOS

1. **Agregar seguridad**: Encriptar contraseñas (bcrypt)
2. **Agregar autenticación**: JWT tokens
3. **Validación robusta**: Joi o express-validator
4. **Desplegar backend**: Azure App Service
5. **Desplegar frontend**: Azure Static Web Apps

Cada paso está documentado en `GUIA_AZURE_SQL_DATABASE.md` 🚀
