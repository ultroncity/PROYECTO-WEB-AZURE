# 🚀 REFERENCIA RÁPIDA - DESPLIEGUE AZURE (1 PÁGINA)

## 📋 LO QUE TIENES

✅ Aplicación web funcional  
✅ Código en carpeta local  
✅ 3 archivos principales (HTML, CSS, JS - 28 KB)  
✅ Documentación completa

---

## ⚡ DESPLIEGUE EN 4 PASOS (10 MIN)

### PASO 1: GitHub (2 min)
```bash
git init
git add .
git commit -m "App inicial"
git remote add origin https://github.com/TU_USUARIO/app-estudiante.git
git branch -M main
git push -u origin main
```

### PASO 2: Azure Portal (3 min)
1. Ve a: https://portal.azure.com
2. Busca: "Static Web Apps"
3. Crea uno nuevo
4. Nombre: `app-estudiante`
5. Conecta GitHub → autoriza → selecciona repo
6. Tipo: Personalizado | App: `.` | Build: `.`
7. Haz clic: "Crear"

### PASO 3: Espera (2-3 min)
- Azure compila automáticamente

### PASO 4: Abre (1 min)
- Copia URL y abre en navegador
- ¡Listo! 🎉

---

## ✅ VERIFICACIÓN RÁPIDA

```
□ Abre http://localhost:8000
□ Registrate: user="test", pass="123"
□ Inicia sesión
□ Cambias fondo a rojo
□ Cierras sesión
✓ Si todo funciona → Listo para Azure
```

---

## 📚 DOCUMENTOS CLAVE

| Archivo | Cuándo Leer |
|---------|-----------|
| `ESTADO_FINAL.md` | Para entender qué tienes |
| `RESUMEN_EJECUTIVO.md` | Para un resumen |
| `INSTRUCCIONES_FINALES.md` | Para paso a paso |
| `GUIA_DESPLIEGUE_COMPLETA.md` | Para detalles |
| `VERIFICACION_PREDESPLIEGUE.md` | Para probar |

---

## 🔗 ENLACES

- Azure Portal: https://portal.azure.com
- GitHub: https://github.com
- Documentación: `GUIA_DESPLIEGUE_COMPLETA.md`

---

## 📱 URL FINAL

Será algo como:
```
https://app-estudiante-abc123.azurestaticapps.net
```

Comparte con tus profesores.

---

## 🎯 RESUMEN

**Tienes:** Aplicación lista  
**Necesitas:** 10 minutos  
**Proceso:** 4 pasos  
**Resultado:** App en la nube ☁️

¡Listo para desplegar! 🚀
