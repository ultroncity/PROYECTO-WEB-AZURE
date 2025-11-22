# ✅ VERIFICACIÓN DE FUNCIONALIDAD - PRE-DESPLIEGUE

Antes de desplegar en Azure, ejecuta esta checklist para asegurar que todo funciona.

## 🔍 PASO 1: Verificar Archivos

```
□ index.html existe
□ estilos.css existe  
□ script.js existe
□ README.md existe
□ GUIA_DESPLIEGUE_COMPLETA.md existe
```

Comando para verificar:
```bash
ls -la *.html *.css *.js *.md
```

## 🌐 PASO 2: Servir Localmente

```bash
# En la carpeta del proyecto, ejecuta:
python -m http.server 8000

# O si usas Python 3:
python3 -m http.server 8000

# Verás algo como:
# Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

## 🧪 PASO 3: Test de Funcionalidad

### TEST 1: Cargar Página
```
✓ Abre: http://localhost:8000
✓ Debe verse el formulario de Login/Registro
✓ Debe haber un botón "Registrarse" y "Iniciar sesión"
```

### TEST 2: Registro de Usuario
```
1. Haz clic en pestaña "Registrarse"
2. Llena:
   - Nombre: "Estudiante Test"
   - Usuario: "test_user_2025"
   - Contraseña: "miContraseña123"
   - Selecciona color: Rojo o azul
3. Haz clic en "Registrarse"
4. Debe aparecer: "Usuario registrado correctamente"

✓ Abre DevTools (F12) → Application → LocalStorage
✓ Debe haber una entrada "usuarios"
✓ Puedes ver tus datos guardados
```

### TEST 3: Iniciar Sesión
```
1. Espera a que vuelva a Login automáticamente
2. Ingresa usuario: "test_user_2025"
3. Ingresa contraseña: "miContraseña123"
4. Haz clic en "Iniciar sesión"

✓ Debes ver el dashboard con:
  - Tu nombre en la parte superior
  - Tabla de Calificaciones
  - Tabla de Horario
  - Botones: ⚙️ Configuración y 🚪 Cerrar sesión
```

### TEST 4: Ver Dashboard
```
Verificar que se muestren:

CALIFICACIONES:
□ 5 asignaturas
□ Calificaciones entre 7-9.5
□ Promedio general mostrado

HORARIO:
□ 5 días (Lunes-Viernes)
□ 4 franjas horarias
□ Al menos 1 "Libre" (en verde)
```

### TEST 5: Cambiar Fondo
```
1. Haz clic en "⚙️ Configuración"
2. Busca "Fondo (color o URL)"
3. Opción A - Cambiar color:
   - Haz clic en el círculo de color
   - Selecciona ROJO (#FF0000)
   - Haz clic en "💾 Guardar cambios"
   ✓ El fondo debe ponerse rojo
   
4. Opción B - Cambiar por URL:
   - Limpia el campo de color
   - Pega: https://images.unsplash.com/photo-1557821552-17105176677c
   - Haz clic en "💾 Guardar cambios"
   ✓ El fondo debe mostrar la imagen
```

### TEST 6: Cambiar Perfil
```
1. En Configuración, cambiar:
   - Nombre: "Nuevo Nombre"
   - Contraseña: "nuevaPassword456"
2. Haz clic en "💾 Guardar cambios"
3. Verás "Cambios guardados correctamente"
4. En el header debe aparecer el nuevo nombre

✓ El nuevo nombre se refleja inmediatamente
```

### TEST 7: Persistencia de Datos
```
1. Registra un usuario (o usa el existente)
2. Cambia el fondo a AMARILLO (#FFFF00)
3. Presiona F5 (Refrescar página)

✓ Debes seguir siendo el mismo usuario
✓ El fondo sigue siendo amarillo
✓ Tus datos persisten
```

### TEST 8: Cerrar Sesión
```
1. Haz clic en "🚪 Cerrar sesión"
2. Debe aparecer el formulario de Login

✓ Se limpian todos los datos de sesión
✓ Vuelves al inicio
```

### TEST 9: Volver a Iniciar Sesión
```
1. Usa las mismas credenciales (usuario/contraseña)
2. Haz clic en "Iniciar sesión"

✓ Debes ver el mismo usuario
✓ Los datos están intactos
```

### TEST 10: Responsive Design
```
1. Con F12 abierto, presiona Ctrl+Shift+M (mobile view)
2. Ajusta a:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)

✓ Debe verse correctamente en todos los tamaños
✓ Los botones deben ser clicables
✓ Las tablas deben ser legibles
```

## 📱 PASO 4: Test en Móvil Real (Opcional)

```
1. Obtén tu IP local:
   - Windows: ipconfig (busca IPv4)
   - Mac/Linux: ifconfig

2. En otro dispositivo en la misma red:
   http://TU_IP_LOCAL:8000

3. Prueba registro, login, cambios de perfil

✓ Debe funcionar igual que en desktop
```

## 🔐 PASO 5: Verificar Seguridad

```
□ Las contraseñas no aparecen en texto plano en localStorage
□ Los datos se borran al cerrar sesión
□ No hay errores de XSS (inyección de código)
□ Las URLs de imágenes se cargan correctamente
```

## 📊 PASO 6: Test de Datos

Abre DevTools (F12) → Application → LocalStorage:

```
Debe haber:

"usuarios": [
  {
    "id": 1234567890,
    "nombre": "Nombre",
    "usuario": "usuario123",
    "password": "contraseña",
    "fondo": "#RRGGBB o URL",
    "fechaRegistro": "2025-11-15T..."
  }
]

"usuarioActual": {
  // mismo objeto anterior
}
```

## ✅ CHECKLIST FINAL PRE-DESPLIEGUE

```
ESTRUCTURA:
□ Todos los archivos están en la misma carpeta
□ No hay archivos faltantes

FUNCIONALIDAD:
□ Registro funciona
□ Login funciona
□ Dashboard se muestra correctamente
□ Calificaciones y Horario visibles
□ Configuración permite cambiar datos
□ Fondo se aplica correctamente
□ Cerrar sesión funciona
□ Datos persisten

DISEÑO:
□ Se ve bien en desktop
□ Se ve bien en tablet
□ Se ve bien en mobile
□ Todos los botones son clicables
□ No hay textos cortados
□ Los colores se ven bien

ERRORES:
□ F12 Console no muestra errores rojos
□ No hay advertencias en red (Network tab)
□ Todas las peticiones devuelven 200 OK

DATOS:
□ localStorage tiene los datos
□ Los datos persisten después de refrescar
□ Puedo tener múltiples usuarios
```

## 🚀 SI PASAS TODOS LOS TESTS

¡Estás listo para desplegar en Azure! Sigue: `GUIA_DESPLIEGUE_COMPLETA.md`

## ⚠️ SI ALGO FALLA

Escribe el error exacto que ves en:
1. DevTools Console (F12 → Console)
2. DevTools Network (F12 → Network)

Ejemplo:
```
Error: "localStorage is not defined"
Solución: Verifica que estés usando un navegador moderno
```

---

**¡Felicidades! Tu aplicación está lista.** ✨
