# ✅ CHECKLIST IMPRIMIBLE - DESPLIEGUE AZURE

**Proyecto:** Aplicación Gestión Estudiantil  
**Alumno:** Omar Gomez  
**Clase:** Programación Web  
**Fecha:** ___________

---

## 📋 PRE-DESPLIEGUE CHECKLIST

### Paso 1: Preparación (10 minutos)

- [ ] Leer REFERENCIA_RAPIDA.md
- [ ] Entender los 4 pasos
- [ ] Tener cuenta GitHub (o crearla)
- [ ] Tener cuenta Azure (o crearla)

### Paso 2: Verificación Local (5 minutos)

- [ ] Servidor HTTP en ejecución (localhost:8000)
- [ ] Página carga sin errores
- [ ] DevTools (F12) sin errores en consola
- [ ] Probar registro (usuario: test, pass: 123)
- [ ] Probar login
- [ ] Dashboard visible
- [ ] Tablas se ven
- [ ] Botones funcionan
- [ ] Cambiar color de fondo funciona
- [ ] Logout funciona

### Paso 3: Verificación de Archivos

- [ ] index.html presente (7.1 KB)
- [ ] estilos.css presente (8.6 KB)
- [ ] script.js presente (12.4 KB)
- [ ] .gitignore presente
- [ ] package.json presente
- [ ] README.md presente

### Paso 4: Preparación GitHub

- [ ] Cuenta GitHub creada
- [ ] Repositorio "app-estudiante" creado
- [ ] Git inicializado localmente

    ```bash
    git init
    git add .
    git commit -m "App inicial"
    ```

- [ ] Cambios commiteados
- [ ] Repositorio en GitHub actualizado

    ```bash
    git remote add origin https://github.com/TU_USER/app-estudiante.git
    git push -u origin main
    ```

---

## ☁️ DESPLIEGUE AZURE CHECKLIST

### Paso 1: Portal Azure (2 minutos)

- [ ] Acceder a https://portal.azure.com
- [ ] Buscar "Static Web Apps"
- [ ] Hacer clic "Create" o "Crear"

### Paso 2: Configuración Básica (1 minuto)

- [ ] Seleccionar subscripción
- [ ] Crear nuevo Resource Group: `app-estudiante-rg`
- [ ] Nombre: `app-estudiante-xxx` (xxx = números aleatorios)
- [ ] Region: `West US 2` (o más cercana)
- [ ] Plan: `Free`

### Paso 3: GitHub (1 minuto)

- [ ] Sign in with GitHub
- [ ] Autorizar Azure
- [ ] Organization: `tu-cuenta`
- [ ] Repository: `app-estudiante`
- [ ] Branch: `main`

### Paso 4: Configuración Build (1 minuto)

- [ ] Build Presets: `Custom`
- [ ] App location: `.`
- [ ] Build location: `.` (dejar vacío)
- [ ] Output location: `.`

### Paso 5: Crear (1 minuto)

- [ ] Review los valores
- [ ] Hacer clic "Create"
- [ ] Esperar compilación (2-3 minutos)

### Paso 6: URL (1 minuto)

- [ ] Copiar URL de la aplicación
- [ ] Formato: `https://app-estudiante-xxx.azurestaticapps.net`
- [ ] Probar en navegador
- [ ] Guardar URL

---

## 🧪 POST-DESPLIEGUE CHECKLIST

### Verificación en Azure

- [ ] URL carga sin errores
- [ ] Página se ve igual que local
- [ ] CSS se aplica correctamente
- [ ] Tablas se muestran

### Pruebas Funcionales

- [ ] Registro funciona en Azure
- [ ] Login funciona en Azure
- [ ] Dashboard visible
- [ ] Calificaciones se ven
- [ ] Horario se ve
- [ ] Botones responden
- [ ] Cambiar color funciona
- [ ] Logout funciona
- [ ] Datos persisten (localStorage)
- [ ] Responsive funciona (prueba en móvil)

### Performance

- [ ] Página carga rápidamente
- [ ] No hay retrasos
- [ ] Tablas se cargan al instante
- [ ] Sin errores de consola

### Seguridad

- [ ] URL es HTTPS (✅ automático en Azure)
- [ ] No hay advertencias de seguridad
- [ ] localStorage funciona

---

## 📊 VERIFICACIÓN DE DATOS

### localStorage Inspection

- [ ] Abrir DevTools (F12)
- [ ] Application → Local Storage
- [ ] Verificar: `usuarios` key existe
- [ ] Verificar: JSON válido
- [ ] Verificar: Datos de usuario guardados

### Primer Usuario

```json
{
  "id": timestamp,
  "nombre": "nombre ingresado",
  "usuario": "usuario ingresado",
  "contraseña": "contraseña ingresada",
  "fondo": "#RRGGBB o URL",
  "fechaRegistro": "ISO date",
  "fechaActualizacion": "ISO date"
}
```

- [ ] ID presente
- [ ] Nombre presente
- [ ] Usuario presente
- [ ] Contraseña presente
- [ ] Fondo presente

---

## 🚀 COMPARTIR CON PROFESORES

- [ ] URL copiada
- [ ] Email/Mensaje preparado
- [ ] Enviar URL con descripción:

```
Hola Profesor(a),

Mi proyecto "Aplicación de Gestión Estudiantil" está disponible en:
https://app-estudiante-xxx.azurestaticapps.net

Características:
- Registro e inicio de sesión
- Dashboard con calificaciones
- Horario de clases
- Perfil personalizable
- Almacenamiento persistente

Para probar:
1. Haz clic en "Hacer una Cuenta"
2. Crea un usuario
3. Inicia sesión
4. Explora el dashboard

Código disponible en GitHub: [enlace]

Saludos,
[Tu nombre]
```

- [ ] Mensaje enviado
- [ ] Profesor(a) accedió
- [ ] Proyecto visto

---

## 📝 DOCUMENTACIÓN ENTREGABLE

- [ ] Código (HTML, CSS, JS) en GitHub
- [ ] README.md con descripción
- [ ] Link a INSTRUCCIONES_FINALES.md
- [ ] Link a ARQUITECTURA.md
- [ ] URL de Azure en README

---

## 🎓 PRESENTACIÓN (OPCIONAL)

Si necesitas presentar en clase:

- [ ] Mostrar URL en navegador
- [ ] Demostrar registro
- [ ] Demostrar login
- [ ] Mostrar dashboard
- [ ] Cambiar color de fondo
- [ ] Cambiar a configuración
- [ ] Logout
- [ ] Explicar arquitectura (HTML/CSS/JS)
- [ ] Mostrar localStorage
- [ ] Mencionar: deployment en Azure, responsivo, etc.

---

## ✅ PROBLEMAS & SOLUCIONES

### Problema: Página en blanco

- [ ] Abrí DevTools (F12)
- [ ] Veo el error en consola
- [ ] Leo GUIA_DESPLIEGUE_COMPLETA.md → Troubleshooting

### Problema: Datos no guardan

- [ ] Verifico que localStorage esté habilitado
- [ ] Pruebo en navegador diferente
- [ ] Leo troubleshooting

### Problema: Botones no funcionan

- [ ] Abrí DevTools
- [ ] Busco errores de JavaScript
- [ ] Leo troubleshooting

### Problema: CSS no se ve

- [ ] Recargo página (Ctrl+F5)
- [ ] Limpio caché (Ctrl+Shift+Delete)
- [ ] Pruebo en navegador diferente

---

## 🎯 NOTAS PERSONALES

```
Problemas encontrados:
_________________________________________________________________________

Soluciones aplicadas:
_________________________________________________________________________

Lo que aprendí:
_________________________________________________________________________

Tiempo total gastado:
_________________________________________________________________________

Éxito final: ✅ / ❌
_________________________________________________________________________
```

---

## 📊 RESUMEN

| Tarea | ✅ |
|-------|---|
| Código preparado | ☐ |
| Verificación local | ☐ |
| GitHub configurado | ☐ |
| Azure creado | ☐ |
| Despliegue exitoso | ☐ |
| Post-despliegue probado | ☐ |
| URL compartida | ☐ |
| Profesor(a) accedió | ☐ |
| **PROYECTO COMPLETADO** | ☐ |

---

## 🎉 CELEBRACIÓN

Cuando hayas completado TODO:

- [ ] ¡Felicitaciones! 🎉
- [ ] Toma una captura de pantalla de la URL en Azure
- [ ] Comparte en redes sociales (opcional)
- [ ] Guarda la documentación para referencia futura
- [ ] Reflexiona sobre lo que aprendiste

---

## 📞 REFERENCIAS RÁPIDAS

**¿Cómo despliego?**
→ INSTRUCCIONES_FINALES.md o GUIA_DESPLIEGUE_COMPLETA.md

**¿Qué hago si algo falla?**
→ GUIA_DESPLIEGUE_COMPLETA.md (sección Troubleshooting)

**¿Cómo verifico que funciona?**
→ VERIFICACION_PREDESPLIEGUE.md

**¿Cómo funciona el código?**
→ ARQUITECTURA.md

---

**Impreso en:** ___________  
**Firmado por:** ___________  
**Status Final:** ✅ COMPLETADO

---

🚀 **¡A DESPLEGAR!** 🚀
