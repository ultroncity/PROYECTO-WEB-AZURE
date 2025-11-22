# 🚀 GUÍA COMPLETA: DESPLIEGUE EN AZURE

## 📋 Tabla de Contenidos
1. [Opción 1: Azure Static Web Apps (Recomendado)](#opción-1-azure-static-web-apps)
2. [Opción 2: Azure App Service](#opción-2-azure-app-service)
3. [Verificación después del despliegue](#verificación)
4. [Troubleshooting](#troubleshooting)

---

## OPCIÓN 1: Azure Static Web Apps (RECOMENDADO)

**¿Por qué es mejor?**
- ✅ Más fácil de configurar
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS incluido (seguridad)
- ✅ Gratis para empezar
- ✅ Ideal para aplicaciones solo frontend

### Requisitos Previos
- ✅ Cuenta de Azure (gratis en https://azure.microsoft.com/es-es/free/)
- ✅ Cuenta en GitHub
- ✅ Git instalado (https://git-scm.com/)

### PASO 1: Prepara tu código

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta los siguientes comandos:

```bash
# Inicializa Git
git init

# Agrega todos los archivos
git add .

# Crea el primer commit
git commit -m "Aplicación de estudiante - versión inicial"
```

### PASO 2: Sube a GitHub

1. Ve a https://github.com
2. Inicia sesión o crea una cuenta
3. Haz clic en **"New"** para crear un repositorio
4. Completa el formulario:
   - **Repository name:** `app-estudiante`
   - **Description:** "Aplicación para gestionar perfil académico"
   - **Public/Private:** Public (para que Azure pueda acceder)
5. Haz clic en **"Create repository"**

6. GitHub te mostrará comandos. Ejecuta estos en tu terminal:

```bash
git remote add origin https://github.com/TU_USUARIO/app-estudiante.git
git branch -M main
git push -u origin main
```

**Resultado:** Tu código está en GitHub

### PASO 3: Crea Static Web App en Azure

1. Ve a https://portal.azure.com
2. Inicia sesión con tu cuenta Azure
3. Busca **"Static Web Apps"** en la barra superior
4. Haz clic en **"Crear Static Web App"**

#### Completa el formulario:

| Campo | Valor | Notas |
|-------|-------|-------|
| **Suscripción** | (selecciona la tuya) | Si es nueva, elige "Free Trial" |
| **Grupo de recursos** | Crear nuevo | Nombre: `app-recursos` |
| **Nombre** | `app-estudiante` | Elige un nombre único |
| **Tipo de plan** | Gratis | Importante: selecciona gratis |
| **Región** | (selecciona cercana) | Ej: `West Europe` si estás en Europa |

Haz clic en **"Siguiente: Conectar con GitHub"**

#### Conecta GitHub:

1. Haz clic en **"Conectar con GitHub"**
2. Se abrirá una ventana para autorizar a Azure
3. Haz clic en **"Authorize AzureStaticWebApps"**
4. Selecciona tu usuario y repositorio

#### Configura la compilación:

| Campo | Valor |
|-------|-------|
| **Organización** | Tu usuario de GitHub |
| **Repositorio** | `app-estudiante` |
| **Rama** | `main` |

Haz clic en **"Siguiente: Revisar y crear"**

#### Configuración de compilación:

| Campo | Valor |
|-------|-------|
| **Tipo de compilación** | Personalizado |
| **Ubicación de aplicación** | `.` (punto) |
| **Ubicación del artefacto de compilación** | `.` (punto) |

Haz clic en **"Revisar y crear"**

### PASO 4: Espera a que se despliegue

1. Haz clic en **"Crear"**
2. Azure empezará a compilar (2-3 minutos)
3. Verás una barra de progreso

Cuando veas **"Despliegue completado"**, ¡tu aplicación está en vivo! 🎉

### PASO 5: Accede a tu aplicación

1. En el dashboard de Azure, busca tu Static Web App
2. Busca **"URL"** en la sección "Essentials"
3. Haz clic en la URL
4. ¡Tu aplicación se abrirá en el navegador!

**Ejemplo de URL:** `https://app-estudiante-abc123.azurestaticapps.net`

---

## OPCIÓN 2: Azure App Service

Para cuando necesites un backend (Node.js) + Base de datos SQL.

### Requisitos Adicionales
- Node.js 16+ instalado
- Base de datos SQL configurada

### Pasos resumidos

1. **Crea un App Service**
   - Ve a Azure Portal
   - Busca "App Service"
   - Selecciona "Node.js 16 LTS"

2. **Configura Deployment**
   - Ve a "Deployment Center"
   - Conecta tu repositorio GitHub
   - Selecciona rama `main`

3. **Configura variables de entorno**
   - Ve a "Configuration"
   - Agrega variables para la base de datos

4. **Azure desplegará automáticamente**

Ver `GUIA_AZURE_BACKEND.md` para detalles completos.

---

## ✅ VERIFICACIÓN DESPUÉS DEL DESPLIEGUE

### Checklist Completo

```
□ La URL funciona en el navegador
□ Puedo ver la página de login
□ Puedo registrarme con un usuario nuevo
□ Puedo iniciar sesión
□ Veo el dashboard con Calificaciones y Horario
□ Puedo hacer clic en "⚙️ Configuración"
□ Puedo cambiar nombre y contraseña
□ Puedo cambiar el fondo (color o URL)
□ Puedo cerrar sesión
□ Los datos persisten al refrescar la página
□ El sitio se ve bien en móvil (abre F12 → Mobile)
```

### Pruebas de Funcionalidad

#### 1. Test de Registro
```
1. Haz clic en "Registrarse"
2. Completa: Nombre, Usuario, Contraseña
3. Selecciona un color
4. Haz clic en "Registrarse"
✓ Debe mostrar "Usuario registrado correctamente"
```

#### 2. Test de Login
```
1. Haz clic en "Iniciar sesión"
2. Ingresa usuario y contraseña
3. Haz clic en "Iniciar sesión"
✓ Debe mostrar el dashboard
```

#### 3. Test de Fondo
```
1. En el dashboard, haz clic en "⚙️ Configuración"
2. Cambia el color con el selector o pon una URL
3. Haz clic en "💾 Guardar cambios"
✓ El fondo debe cambiar inmediatamente
```

#### 4. Test de Persistencia
```
1. Registra un usuario
2. Cambia el fondo a un color rojo (#FF0000)
3. Presiona F5 (refrescar página)
✓ Debes seguir siendo el mismo usuario con fondo rojo
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Error al conectar con GitHub"

**Solución:**
1. Ve a https://github.com/settings/connections/applications
2. Busca "Azure Static Web Apps"
3. Autoriza la aplicación
4. Intenta nuevamente en Azure

---

### Problema: "Despliegue fallido"

**Causas comunes:**
- Tu repositorio es privado (cámbialo a público)
- Hay archivos con caracteres especiales
- La rama no es `main`

**Solución:**
1. En Azure, ve a "Build and Deploy"
2. Busca el log de errores
3. Lee el error específico
4. Haz cambios locales
5. Haz `git push` nuevamente

---

### Problema: "La página carga pero no funciona"

**Causas:**
- Los datos no se están guardando
- Hay errores de JavaScript

**Solución:**
1. Abre DevTools (F12)
2. Ve a "Console"
3. ¿Hay errores rojos?
4. Lee el error
5. Si es de localStorage, verifica que no esté bloqueado
6. Intenta en modo Incógnito

---

### Problema: "¿Cómo sé si mi app está en vivo?"

**Verificación:**
```
1. Abre https://portal.azure.com
2. Busca tu Static Web App
3. En "Essentials", busca "URL"
4. Haz clic en la URL
5. Si se abre tu aplicación = ✓ Funcionando
```

---

### Problema: "Quiero hacer cambios a la app"

**Proceso:**
1. Haz cambios locales en `index.html`, `estilos.css`, `script.js`
2. En terminal:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. Azure detectará el cambio automáticamente
4. Se redesplegará en 1-2 minutos
5. Tu sitio estará actualizado

---

### Problema: "Mi app es muy lenta"

**Soluciones:**
- Usa URLs de imágenes comprimidas
- Reduce tamaño de JavaScript
- Para Azure Static Web Apps, usa CDN (incluido)

---

### Problema: "Cómo compartir mi app con otros"

**Respuesta:**
- Solo comparte la URL: `https://app-estudiante-abc123.azurestaticapps.net`
- Funciona en cualquier navegador
- No necesitan instalar nada

---

## 📞 SOPORTE RÁPIDO

### Validar que funciona localmente primero

```bash
# En terminal:
python -m http.server 8000

# Abre en navegador:
http://localhost:8000

# Si funciona localmente, funcionará en Azure
```

### Revisar logs en Azure

1. Ve a Azure Portal
2. Busca tu Static Web App
3. Haz clic en ella
4. Ve a "Deployment details"
5. Busca el log del último despliegue

---

## ✨ FELICIDADES

Si completaste todos los pasos, ¡tu aplicación está en vivo en Azure! 🎉

**Siguiente paso:** Comparte tu URL con tus profesores y compañeros.

---

**Notas Finales:**
- El plan gratuito es suficiente para desarrollar
- Tu aplicación está asegurada con HTTPS
- Los datos se guardan en el navegador (localStorage)
- Si necesitas base de datos, usa Opción 2 (App Service)
