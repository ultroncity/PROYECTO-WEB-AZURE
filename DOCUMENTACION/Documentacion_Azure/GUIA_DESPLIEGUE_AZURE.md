# Guía de Despliegue en Azure

## Sistema de Usuarios con Base de Datos Separada

Este documento proporciona instrucciones paso a paso para desplegar tu aplicación web de gestión de usuarios en Microsoft Azure con una base de datos separada.

---

## 📋 Requisitos Previos

1. **Cuenta de Azure** - [Crear cuenta gratuita](https://azure.microsoft.com/es-es/free/)
2. **Azure CLI** - [Descargar](https://learn.microsoft.com/es-es/cli/azure/install-azure-cli)
3. **Git** - [Descargar](https://git-scm.com)
4. **Node.js** (opcional, para desarrollo local)

---

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────┐
│   Aplicación    │
│   Web (HTML,    │
│   CSS, JS)      │
│  App Service    │
└────────┬────────┘
         │
         │ API REST
         │
┌────────▼────────────────┐
│   Backend (Node.js)     │
│   (servidor API)        │
│   App Service           │
└────────┬────────────────┘
         │
    ┌────▼─────┐
    │  Azure   │
    │ Database │
    │ (SQL DB) │
    └──────────┘
```

---

## 🚀 Opción 1: Despliegue Rápido con Azure Portal

### Paso 1: Crear un App Service

1. Ve a [Azure Portal](https://portal.azure.com)
2. Haz clic en **"Crear un recurso"**
3. Busca y selecciona **"App Service"**
4. Completa el formulario:
   - **Grupo de recursos**: Crear uno nuevo (ej: `rg-usuarios-app`)
   - **Nombre**: Ej: `mi-sistema-usuarios`
   - **Publicar**: HTML
   - **Sistema operativo**: Linux
   - **Región**: Selecciona la más cercana
   - **Plan de tarifa**: F1 (gratuito)
5. Haz clic en **"Revisar y crear"** → **"Crear"**

### Paso 2: Crear Base de Datos SQL

1. En Azure Portal, ve a **"Crear un recurso"**
2. Busca **"Azure SQL Database"**
3. Completa:
   - **Grupo de recursos**: Selecciona el mismo grupo anterior
   - **Nombre de BD**: Ej: `dbUsuarios`
   - **Servidor**: Crea uno nuevo
     - **Nombre del servidor**: Ej: `servidor-usuarios`
     - **Ubicación**: Misma región que el App Service
     - **Autenticación**: SQL Server authentication
     - **Admin**: Crea un usuario (ej: `adminusuario`)
     - **Contraseña**: Crea una contraseña segura
4. **Configuración de conectividad**: Endpoint público
5. **Calcular y almacenamiento**: DTU básico o sin servidor
6. Haz clic en **"Crear"**

### Paso 3: Descargar código de publicación

1. Ve a tu App Service creado
2. Ve a **"Centro de implementación"**
3. Selecciona **"Git local"**
4. Copia la URL del repositorio Git
5. En tu terminal, en la carpeta del proyecto:

```bash
git init
git config user.email "tu@email.com"
git config user.name "Tu Nombre"
git remote add azure <URL_COPIADA>
git add .
git commit -m "Initial commit"
git push azure main
```

---

## 🛠️ Opción 2: Despliegue con Azure DevOps (Recomendado)

### Paso 1: Preparar el repositorio

1. Crea un repositorio en GitHub
2. Sube tu código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuusuario/tu-repo.git
git push -u origin main
```

### Paso 2: Crear Pipeline en Azure DevOps

1. Ve a [Azure DevOps](https://dev.azure.com)
2. Crea un nuevo proyecto
3. Ve a **"Pipelines"** → **"Crear nuevo pipeline"**
4. Selecciona **"GitHub"** y conecta tu repositorio
5. Selecciona **"HTML, CSS, JavaScript"**

### Paso 3: Crear archivo `azure-pipelines.yml`

Crea este archivo en la raíz del proyecto:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  inputs:
    version: '7.x'
    packageType: 'runtime'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.SourcesDirectory)'
    ArtifactName: 'drop'
    publishLocation: 'Container'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'Tu-Subscription'
    appType: 'webApp'
    appName: 'mi-sistema-usuarios'
    package: '$(Build.ArtifactStagingDirectory)/**/*.zip'
```

---

## 🗄️ Configuración de Base de Datos

### Crear tabla de usuarios

En Azure SQL Database:

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
```

### Obtener cadena de conexión

1. Ve a tu recurso de SQL Database en Azure Portal
2. Ve a **"Cadenas de conexión"**
3. Copia la cadena de conexión (ADO.NET)
4. Reemplaza `{your_password}` con tu contraseña

---

## 📝 Variables de Entorno

En tu App Service, configura las siguientes variables:

1. Ve a tu App Service
2. Ve a **"Configuración"** → **"Configuración de la aplicación"**
3. Agrega las siguientes variables:

```
DATABASE_URL = <tu-cadena-de-conexion>
NODE_ENV = production
PORT = 80
API_KEY = <tu-clave-api-segura>
```

---

## 🔒 Seguridad Recomendada

### 1. Usar Azure Key Vault

```bash
# Crear Key Vault
az keyvault create --name "usuarios-keyvault" --resource-group "rg-usuarios-app"

# Almacenar secretos
az keyvault secret set --vault-name "usuarios-keyvault" --name "db-password" --value "tu-contraseña"
```

### 2. Configurar CORS

Agrega a tu aplicación:

```javascript
const corsOptions = {
  origin: 'https://mi-sistema-usuarios.azurewebsites.net',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 3. Usar HTTPS obligatorio

En Azure Portal:
- App Service → Configuración → HTTPS sólo → ON

---

## 📊 Monitoreo

### Application Insights

1. En tu App Service, ve a **"Application Insights"**
2. Haz clic en **"Activar Application Insights"**
3. Crea un nuevo recurso de Application Insights
4. Espera a que se vincule (2-3 minutos)

### Ver logs

```bash
az webapp log tail --resource-group "rg-usuarios-app" --name "mi-sistema-usuarios"
```

---

## 🧪 Verificar Despliegue

1. Ve a tu App Service en Azure Portal
2. Copia la URL (ej: https://mi-sistema-usuarios.azurewebsites.net)
3. Abre en navegador
4. Prueba:
   - ✅ Registra un usuario
   - ✅ Inicia sesión
   - ✅ Edita perfil
   - ✅ Cambia fondo
   - ✅ Cierra sesión

---

## 🆘 Solución de Problemas

### Error 500

```bash
# Ver logs
az webapp log stream --resource-group "rg-usuarios-app" --name "mi-sistema-usuarios"
```

### Aplicación no carga

1. Verifica que el archivo `index.html` esté en la raíz
2. Revisa las configuraciones de aplicación
3. Limpia cache del navegador (Ctrl+Shift+Delete)

### Problemas de base de datos

```bash
# Probar conexión
sqlcmd -S servidor-usuarios.database.windows.net -U adminusuario -P "tu-contraseña" -d dbUsuarios
```

---

## 💰 Estimación de Costos

| Servicio | Plan | Costo Mensual |
|----------|------|--------------|
| App Service | F1 (Gratuito) | $0 |
| SQL Database | DTU Básico | ~$5 |
| Application Insights | Gratuito (primeros 5GB) | $0 |
| **TOTAL** | | **~$5** |

---

## 🔄 Actualizar Aplicación

Después de hacer cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push azure main
```

O si usas GitHub:

```bash
git push origin main
# El pipeline de Azure DevOps se ejecutará automáticamente
```

---

## 📞 Recursos Útiles

- [Documentación Azure App Service](https://learn.microsoft.com/es-es/azure/app-service/)
- [Documentación Azure SQL Database](https://learn.microsoft.com/es-es/azure/azure-sql/database/)
- [Precios Azure](https://azure.microsoft.com/es-es/pricing/)

---

**Última actualización**: Noviembre 2025

Para preguntas o problemas, consulta la documentación oficial de Azure o contacta al equipo de soporte.
