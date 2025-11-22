# 📚 Sistema de Gestión de Perfil de Estudiante

Sistema moderno de gestión académica con dashboard de calificaciones, horario de clases y personalización de perfil.

## ✨ Características

- ✅ **Registro e inicio de sesión** de usuarios
- ✅ **Gestión de perfil** completa
- ✅ **Cambio de contraseña** seguro
- ✅ **Personalización de fondo** (colores o URLs)
- ✅ **Cerrar sesión** con regreso a login
- ✅ **Eliminación de cuenta**
- ✅ **Interfaz responsive**
- ✅ **Base de datos separada** (Azure SQL Database)
- ✅ **API REST** segura

---

## 🛠️ Tecnologías

### Frontend
- HTML5
- CSS3 (responsive design)
- JavaScript vanilla (ES6+)
- LocalStorage para sesiones temporales

### Backend
- Node.js
- Express.js
- Azure SQL Database
- bcryptjs (encriptación de contraseñas)

---

## 📦 Instalación Local

### Requisitos Previos
- Node.js 16+ ([Descargar](https://nodejs.org))
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/sistema-usuarios.git
cd sistema-usuarios
```

2. **Instalar dependencias del backend**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Edita .env con tus valores de Azure SQL Database
```

4. **Iniciar el servidor**
```bash
npm start
# O para desarrollo con auto-reload:
npm run dev
```

5. **Abrir en navegador**
```
http://localhost:3000
```

---

## 🗄️ Base de Datos

### Crear tabla de usuarios

```sql
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Usuario NVARCHAR(50) NOT NULL UNIQUE,
    Contraseña NVARCHAR(255) NOT NULL,
    Fondo NVARCHAR(MAX),
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_usuario ON Usuarios(Usuario);
```

---

## 🚀 Despliegue en Azure

Sigue la **[Guía de Despliegue en Azure](./GUIA_DESPLIEGUE_AZURE.md)** para:
- Crear App Service
- Configurar Azure SQL Database
- Desplegar automáticamente desde GitHub

### Despliegue Rápido
```bash
# Desplegar en App Service existente
az webapp deployment source config-zip --resource-group mi-grupo --name mi-app --src deploy.zip
```

---

## 📡 API Endpoints

### Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "usuario": "juan123",
  "password": "micontraseña",
  "fondo": "#FF5733"
}
```

#### Inicio de Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "usuario": "juan123",
  "password": "micontraseña"
}
```

### Perfil de Usuario

#### Obtener Perfil
```http
GET /api/profile/:userId
```

#### Actualizar Perfil
```http
PUT /api/profile/:userId
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "password": "nuevacontraseña",
  "fondo": "https://imagen.jpg"
}
```

#### Eliminar Cuenta
```http
DELETE /api/profile/:userId
```

---

## 🔐 Seguridad

### Contraseñas
- Encriptadas con bcryptjs (10 salts)
- Nunca se almacenan en texto plano
- Validación de fortaleza recomendada

### Sesiones
- LocalStorage para cliente
- JWT para API (implementación recomendada)
- HTTPS obligatorio en producción

### Base de Datos
- Conexión encriptada (TLS)
- Firewall configurado
- Credenciales en Key Vault

---

## 🧪 Testing

### Pruebas Manuales
1. Registra un nuevo usuario
2. Inicia sesión
3. Edita tu perfil
4. Cambia tu fondo
5. Cierra sesión
6. Verifica que regresaste al login

### Pruebas Automatizadas (próximamente)
```bash
npm test
```

---

## 📸 Capturas de Pantalla

### Pantalla de Login
```
┌─────────────────────────┐
│  Sistema de Usuarios    │
│                         │
│  [ LOGIN ] [ REGISTRO ] │
│                         │
│  Usuario: [________]    │
│  Contraseña: [____]     │
│  [Iniciar Sesión]       │
└─────────────────────────┘
```

### Pantalla de Perfil
```
┌──────────────────────────────┐
│ Nombre del Usuario [Cerrar]  │
├──────────────────────────────┤
│ Usuario: juanperez           │
│ Nombre: [_____________]      │
│ Contraseña: [______]         │
│ Fondo: [color] [🎨] [URL]    │
│                              │
│ [Guardar] [Eliminar]         │
└──────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
```bash
# Verificar variables de entorno
cat .env

# Probar conexión con Azure CLI
az sql db list-by-server --server-name mi-servidor --resource-group mi-grupo
```

### Error: "Usuario o contraseña incorrectos"
- Verifica que el usuario está en la base de datos
- Revisa logs del servidor: `npm logs`

### Aplicación lenta
- Verificar índices en base de datos
- Revisar Application Insights en Azure

---

## 📝 Estructura de Carpetas

```
proyecto/
├── index.html                 # Página principal
├── estilos.css               # Estilos CSS
├── script.js                 # JavaScript frontend
├── server.js                 # Backend Node.js
├── package.json              # Dependencias npm
├── .env.example              # Variables de ejemplo
├── .gitignore                # Archivos a ignorar
├── README.md                 # Este archivo
├── GUIA_DESPLIEGUE_AZURE.md  # Guía de despliegue
└── public/                   # Archivos estáticos (opcional)
```

---

## 🔄 Roadmap

- [ ] Autenticación con OAuth (Google, Microsoft)
- [ ] Búsqueda y filtrado de usuarios (admin)
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Autenticación de dos factores (2FA)
- [ ] Panel de administración
- [ ] Exportar datos de usuario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

**Omar Gómez**  
📧 Email: tu@email.com  
🔗 GitHub: [@tuusuario](https://github.com/tuusuario)  

---

## 🙏 Agradecimientos

- [Azure Documentation](https://learn.microsoft.com/azure/)
- [Express.js](https://expressjs.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Última actualización**: Noviembre 2025

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!
