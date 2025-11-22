# ⚡ COMANDOS COPY-PASTE (Listos para usar)

## 🚀 INSTALACIÓN (Copia y pega en PowerShell)

### 1. Navegar a tu proyecto
```powershell
cd "c:\Users\Omar Gomez\Universidad\Programacion Web\Proyecto Final programacion web\Proyecto Referencia"
```

### 2. Instalar todas las dependencias (opción más fácil)
```powershell
npm install express@4.18.2 body-parser@1.20.2 mssql@9.1.1 dotenv@16.3.1 cors@2.8.5 uuid@9.0.0 node-fetch@2.6.11 --save
```

### 3. Instalar nodemon para desarrollo
```powershell
npm install -D nodemon@3.0.1
```

### 4. Verificar instalación
```powershell
npm list
```

---

## 🔧 CONFIGURACIÓN (.env)

### Crear archivo .env (opción 1 - PowerShell)
```powershell
# Esto crea el archivo .env vacío
New-Item -Path .env -ItemType File

# Luego abre con notepad:
notepad .env
```

### O crea .env manualmente (opción 2)

1. En VS Code: Ctrl+K Ctrl+N (nuevo archivo)
2. Nombra: `.env`
3. Pega esto (reemplazando con TUS datos):

```plaintext
DB_SERVER=tu-servidor.database.windows.net
DB_NAME=tu_base_de_datos
DB_USER=tuusuario@tu-servidor
DB_PASSWORD=TuContraseña123!
PORT=3000
NODE_ENV=development
```

**Ejemplo REAL:**
```plaintext
DB_SERVER=myserver123.database.windows.net
DB_NAME=estudiantes_db
DB_USER=adminuser@myserver123
DB_PASSWORD=Segura#Pass123!@
PORT=3000
NODE_ENV=development
```

---

## 📊 SQL (Copiar a Azure Portal)

### Ir a Azure Portal SQL Query Editor

1. Azure Portal → SQL Databases → Tu BD
2. Query Editor (lado izquierdo)
3. Inicia sesión
4. Copia TODO esto:

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- CREAR TABLA USUARIOS
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT PRIMARY KEY IDENTITY(1,1),
        uuid VARCHAR(36) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        contraseña VARCHAR(100) NOT NULL,
        fondo VARCHAR(255),
        fechaRegistro DATETIME DEFAULT GETUTCDATE(),
        fechaActualizacion DATETIME DEFAULT GETUTCDATE()
    );

    CREATE INDEX idx_usuario ON usuarios(usuario);
    CREATE INDEX idx_uuid ON usuarios(uuid);

    PRINT 'Tabla usuarios creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla usuarios ya existe';
END;

-- Verificar
SELECT * FROM usuarios;
```

5. Presiona: **Ctrl+Enter** para ejecutar
6. Deberías ver: ✅ Sin errores

---

## 🖥️ EJECUTAR SERVIDOR

### Opción 1: Ejecución simple (Recomendado para pruebas)
```powershell
node backend-server-v2.js
```

### Opción 2: Con auto-reload (Recomendado para desarrollo)
```powershell
npx nodemon backend-server-v2.js
```

### Opción 3: Usando npm scripts
```powershell
npm start
```

**Deberías ver:**
```
═══════════════════════════════════════════════════════════════
🚀 SERVIDOR BACKEND ACTIVO
═══════════════════════════════════════════════════════════════
📡 Puerto: 3000
🌐 Base de datos: tu_base_de_datos
🔌 Servidor: tu-servidor.database.windows.net
```

---

## ✅ PROBAR SERVIDOR (En OTRA PowerShell)

### 1. Health Check (¿está vivo?)
```powershell
curl http://localhost:3000/api/health
```

### 2. Registrar usuario
```powershell
$body = @{
    nombre = "Juan Pérez"
    usuario = "juan" + (Get-Random)
    contraseña = "Password123"
    fondo = "#3498db"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

### 3. Iniciar sesión
```powershell
$body = @{
    usuario = "juan[numero]"
    contraseña = "Password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

### 4. Obtener usuario (reemplaza UUID)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/tu-uuid-aqui" `
    -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

### 5. Actualizar usuario
```powershell
$body = @{
    nombre = "Nuevo Nombre"
    fondo = "#e74c3c"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/tu-uuid-aqui" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

### 6. Eliminar usuario
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/tu-uuid-aqui" `
    -Method DELETE | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 🧪 EJECUTAR PRUEBAS

### En una nueva PowerShell:
```powershell
npm test
```

### O directamente:
```powershell
node test-backend.js
```

**Espera a que vea:**
```
✅ PASÓ: GET /api/health - Servidor activo
✅ PASÓ: POST /api/auth/register - Registro exitoso
✅ PASÓ: POST /api/auth/login - Login exitoso
...
🎉 ¡TODAS LAS PRUEBAS PASARON!
```

---

## 🌐 SERVIR FRONTEND LOCAL

### Opción 1: Python (si tienes instalado)
```powershell
python -m http.server 8000
```

### Opción 2: Node.js
```powershell
npm install -g http-server
http-server -p 8000
```

### Opción 3: Live Server de VS Code
- Clic derecho en `index.html`
- "Open with Live Server"

Luego abre: http://localhost:8000

---

## 🔍 VERIFICAR TODO

### Ver qué está corriendo
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### Ver logs en tiempo real
```powershell
# En la PowerShell del servidor, solo ves los logs
# Los GET/POST aparecen automáticamente
```

### Verificar base de datos
```sql
-- En Query Editor de Azure SQL:

SELECT COUNT(*) as TotalUsuarios FROM usuarios;
SELECT * FROM usuarios;
```

---

## 📋 CAMBIOS AL FRONTEND

### Actualizar index.html

**Cambiar de:**
```html
<script src="script.js"></script>
```

**A:**
```html
<script src="script-con-api.js"></script>
```

Luego recarga el navegador (Ctrl+F5 para limpiar cache)

---

## 🆘 SOLUCIONAR PROBLEMAS

### Error: "Cannot find module 'mssql'"
```powershell
npm install mssql
```

### Error: "ECONNREFUSED"
```powershell
# El backend no está corriendo
# En otra PowerShell:
node backend-server-v2.js
```

### Error: "Login failed for user"
```powershell
# Verificar .env - abre y chequea:
# DB_USER debe ser: usuario@servidor (NO solo usuario)
# DB_PASSWORD debe ser exacto (respeta mayúsculas)

notepad .env
```

### Error: "Network timeout"
```powershell
# Agrega tu IP a Azure SQL Firewall
# Azure Portal → SQL Server → Firewalls

# O agrega: 0.0.0.0 - 255.255.255.255 (No recomendado)
```

### CORS error en frontend
```javascript
// En backend-server-v2.js, agrega tu URL:
// Línea ~30:
origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://tu-dominio.com'  // Agregar aquí
]
```

---

## 📊 COMANDOS ÚTILES

### Ver estructura del proyecto
```powershell
tree /F
```

### Ver versión de Node
```powershell
node --version
npm --version
```

### Ver puertos en uso
```powershell
netstat -ano | findstr LISTENING
```

### Matar proceso en puerto 3000
```powershell
# Windows PowerShell (como Admin):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# O más simple (CMD como Admin):
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

---

## 📱 RESPUESTAS DE API (Para referencia)

### Health Check (200 OK)
```json
{
  "éxito": true,
  "mensaje": "Servidor funcionando correctamente",
  "datos": {
    "status": "online",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 125.456
  }
}
```

### Registro (201 Created)
```json
{
  "éxito": true,
  "mensaje": "Usuario registrado exitosamente",
  "datos": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan Pérez",
    "usuario": "juan123",
    "fondo": "#3498db"
  }
}
```

### Login (200 OK)
```json
{
  "éxito": true,
  "mensaje": "Sesión iniciada correctamente",
  "datos": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan Pérez",
    "usuario": "juan123",
    "fondo": "#3498db",
    "fechaRegistro": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error (400 Bad Request)
```json
{
  "éxito": false,
  "error": "El usuario debe tener al menos 3 caracteres"
}
```

---

## 🎯 CHECKLIST RÁPIDO

```powershell
# 1. Navegar
cd "C:\ruta\a\tu\proyecto"

# 2. Instalar
npm install express@4.18.2 body-parser@1.20.2 mssql@9.1.1 dotenv@16.3.1 cors@2.8.5 uuid@9.0.0 node-fetch@2.6.11

# 3. Configurar (crear .env con tus datos)
notepad .env

# 4. BD (ejecutar setup-database.sql en Azure Portal)

# 5. Prueba (en terminal 1)
node backend-server-v2.js

# 6. Tests (en terminal 2)
npm test

# 7. Frontend (en terminal 3)
python -m http.server 8000

# 8. Accede
http://localhost:8000
```

---

## 🎁 ALIAS ÚTILES

Agrega estos al PowerShell profile para el futuro:

```powershell
# PowerShell Profile location:
notepad $PROFILE

# Copia esto al final:
function start-backend { node backend-server-v2.js }
function test-backend { npm test }
function dev-backend { npx nodemon backend-server-v2.js }
function serve-frontend { python -m http.server 8000 }
```

Luego recarga PowerShell y usa:
```powershell
start-backend
test-backend
dev-backend
serve-frontend
```

---

## 📞 RESUMEN FINAL

| Comando | Propósito | Cuando |
|---------|-----------|--------|
| `npm install ...` | Instalar dependencias | Una vez |
| `node backend-server-v2.js` | Iniciar servidor | Cada sesión |
| `npm test` | Ejecutar pruebas | Después de cambios |
| `python -m http.server 8000` | Servir frontend | Para probar |
| `npm run dev` | Dev con nodemon | Durante desarrollo |

---

**¡Listo para copiar-pegar!** ✨

Copia los comandos de arriba y pégalos en PowerShell uno por uno.
