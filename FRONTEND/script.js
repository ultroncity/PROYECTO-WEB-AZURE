/* ============================================================================
   SCRIPT FINAL COMPATIBLE CON TU BACKEND (usa: éxito, mensaje, error, datos)
   Totalmente adaptado y funcional para Azure Static Web App
============================================================================ */

// ======================================================
// CONFIGURACIÓN BACKEND
// ======================================================
const API_URL =
  "https://proyecto-web-backend-g2fsevcfegcfbtdj.canadaeast-01.azurewebsites.net/api";

let usuarioActual = null;

// ======================================================
// FUNCIÓN GENERAL PARA LLAMAR A LA API
// ======================================================
async function llamarAPI(endpoint, metodo = "GET", datos = null) {
  try {
    const config = {
      method: metodo,
      headers: { "Content-Type": "application/json" }
    };

    if (datos) config.body = JSON.stringify(datos);

    const respuesta = await fetch(API_URL + endpoint, config);
    const json = await respuesta.json();

    return json; // tu backend siempre devuelve JSON con éxito/error
  } catch (error) {
    console.error("❌ Error API:", error);
    return { éxito: false, error: "No se pudo conectar con el servidor." };
  }
}

// ======================================================
// MANEJO DE SESIÓN
// ======================================================
function guardarSesion(data) {
  sessionStorage.setItem("usuarioActual", JSON.stringify(data));
  usuarioActual = data;
}

function obtenerSesion() {
  const s = sessionStorage.getItem("usuarioActual");
  return s ? JSON.parse(s) : null;
}

function limpiarSesion() {
  sessionStorage.removeItem("usuarioActual");
  usuarioActual = null;
}

// ======================================================
// REGISTRO
// ======================================================
async function registrarUsuarioAPI() {
  const nombre = document.getElementById("nombreRegistro").value;
  const usuario = document.getElementById("usuarioRegistro").value;
  const contraseña = document.getElementById("passwordRegistro").value;
  const fondo =
    document.getElementById("fondoRegistro").value.trim() ||
    document.getElementById("colorInput").value;

  const resultado = await llamarAPI("/auth/register", "POST", {
    nombre,
    usuario,
    contraseña,
    fondo
  });

  if (!resultado.éxito) {
    alert("❌ " + (resultado.error || resultado.mensaje));
    return;
  }

  alert("✅ " + resultado.mensaje);
  document.getElementById("btnLogin").click();
}

// ======================================================
// LOGIN
// ======================================================
async function iniciarSesionAPI() {
  const usuario = document.getElementById("usuarioLogin").value;
  const contraseña = document.getElementById("passwordLogin").value;

  const resultado = await llamarAPI("/auth/login", "POST", {
    usuario,
    contraseña
  });

  if (!resultado.éxito) {
    alert("❌ " + resultado.error);
    return;
  }

  guardarSesion(resultado.datos);
  mostrarPaginaPerfil();
}

// ======================================================
// OBTENER USUARIO ACTUAL
// ======================================================
async function cargarDatosUsuario() {
  const resultado = await llamarAPI(`/usuarios/${usuarioActual.uuid}`, "GET");

  if (resultado.éxito) {
    usuarioActual = resultado.datos;
    guardarSesion(resultado.datos);
  }
}

// ======================================================
// ACTUALIZAR PERFIL
// ======================================================
async function guardarCambiosAPI() {
  const nombre = document.getElementById("nuevoNombre").value;
  const contraseña = document.getElementById("nuevoPass").value;
  const fondo =
    document.getElementById("nuevoFondo").value.trim() ||
    document.getElementById("colorPicker").value;

  const resultado = await llamarAPI(`/usuarios/${usuarioActual.uuid}`, "PUT", {
    nombre,
    contraseña,
    fondo
  });

  if (!resultado.éxito) {
    alert("❌ " + resultado.error);
    return;
  }

  usuarioActual = resultado.datos;
  guardarSesion(resultado.datos);

  aplicarFondo(usuarioActual.fondo);
  document.getElementById("nombrePerfil").textContent =
    usuarioActual.nombre;

  alert("✅ " + resultado.mensaje);
}

// ======================================================
// ELIMINAR CUENTA
// ======================================================
async function eliminarCuentaAPI() {
  if (!confirm("¿Eliminar cuenta permanentemente?")) return;

  const resultado = await llamarAPI(
    `/usuarios/${usuarioActual.uuid}`,
    "DELETE"
  );

  if (!resultado.éxito) {
    alert("❌ " + resultado.error);
    return;
  }

  alert("🗑️ " + resultado.mensaje);
  cerrarSesion();
}

// ======================================================
// ---- UI (INTERFAZ) ----
// Basada en tu archivo original script.js
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarAuth();

  const sesion = obtenerSesion();
  if (sesion) {
    usuarioActual = sesion;
    mostrarPaginaPerfil();
  }
});

// ======================================================
// INICIALIZACIÓN LOGIN / REGISTRO
// ======================================================
function inicializarAuth() {
  const btnLogin = document.getElementById("btnLogin");
  const btnRegistro = document.getElementById("btnRegistro");
  const slider = document.querySelector(".switch-slider");

  const panelLogin = document.getElementById("panelLogin");
  const panelRegistro = document.getElementById("panelRegistro");

  btnLogin.onclick = () => {
    btnLogin.classList.add("active");
    btnRegistro.classList.remove("active");
    slider.style.transform = "translateX(0%)";
    panelLogin.classList.add("active");
    panelRegistro.classList.remove("active");
  };

  btnRegistro.onclick = () => {
    btnRegistro.classList.add("active");
    btnLogin.classList.remove("active");
    slider.style.transform = "translateX(100%)";
    panelRegistro.classList.add("active");
    panelLogin.classList.remove("active");
  };

  // --- COLOR PICKER REGISTRO ---
  const colorPreview = document.getElementById("colorPreview");
  const colorInput = document.getElementById("colorInput");
  const fondoRegistro = document.getElementById("fondoRegistro");

  colorPreview.onclick = () => {
    if (!colorPreview.classList.contains("disabled")) {
      colorInput.click();
    }
  };

  colorInput.oninput = () => {
    colorPreview.style.background = colorInput.value;
    fondoRegistro.value = "";
    colorPreview.classList.remove("disabled");
  };

  fondoRegistro.oninput = () => {
    if (fondoRegistro.value.trim()) {
      colorPreview.classList.add("disabled");
      colorPreview.style.background = "#999";
    } else {
      colorPreview.classList.remove("disabled");
      colorPreview.style.background = colorInput.value;
    }
  };

  // FORMULARIO LOGIN
  document.getElementById("formLogin").onsubmit = (e) => {
    e.preventDefault();
    iniciarSesionAPI();
  };

  // FORMULARIO REGISTRO
  document.getElementById("formRegistro").onsubmit = (e) => {
    e.preventDefault();
    registrarUsuarioAPI();
  };
}

// ======================================================
// PAGINA PERFIL
// ======================================================
function mostrarPaginaPerfil() {
  document.getElementById("paginaAuth").style.display = "none";
  document.getElementById("paginaPerfil").style.display = "block";

  document.getElementById("nombrePerfil").textContent =
    usuarioActual.nombre;
  document.getElementById("usuarioPerfil").textContent =
    usuarioActual.usuario;

  document.getElementById("nuevoNombre").value = usuarioActual.nombre;
  document.getElementById("nuevoPass").value = "";
  document.getElementById("nuevoFondo").value = usuarioActual.fondo;

  aplicarFondo(usuarioActual.fondo);

  document.getElementById("btnConfiguracion").onclick =
    mostrarConfiguracion;
  document.getElementById("btnCerrarSesion").onclick = cerrarSesion;
  document.getElementById("btnGuardar").onclick = guardarCambiosAPI;
  document.getElementById("btnEliminar").onclick = eliminarCuentaAPI;
  document.getElementById("btnVolver").onclick = volverAlPrincipal;
}

// ======================================================
// CAMBIO DE SECCIONES (CONFIG / PRINCIPAL)
// ======================================================
function mostrarConfiguracion() {
  document.getElementById("contenidoPrincipal").style.display = "none";
  document.getElementById("contenidoConfiguracion").style.display = "block";
}

function volverAlPrincipal() {
  document.getElementById("contenidoPrincipal").style.display = "block";
  document.getElementById("contenidoConfiguracion").style.display = "none";
}

// ======================================================
// CERRAR SESIÓN
// ======================================================
function cerrarSesion() {
  limpiarSesion();
  document.getElementById("paginaAuth").style.display = "flex";
  document.getElementById("paginaPerfil").style.display = "none";
}

// ======================================================
// APLICAR FONDO
// ======================================================
function aplicarFondo(fondo) {
  const pagina = document.getElementById("paginaPerfil");

  if (!fondo) {
    pagina.style.background =
      "linear-gradient(135deg, #e6ecf5, #f5f7fa)";
    return;
  }

  if (fondo.startsWith("http")) {
    pagina.style.backgroundImage = `url(${fondo})`;
    pagina.style.backgroundSize = "cover";
    pagina.style.backgroundPosition = "center";
    return;
  }

  pagina.style.background = fondo;
}

