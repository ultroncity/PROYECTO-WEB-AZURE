const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['https://wonderful-ocean-0f4a4fd1e.3.azurestaticapps.net'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000
    }
};

let pool;

async function conectarBaseDatos() {
    try {
        pool = new sql.ConnectionPool(config);
        await pool.connect();
        console.log('✅ Conectado a Azure SQL Database');
        await crearTablas();
    } catch (error) {
        console.error('❌ Error conectando a BD:', error.message);
        setTimeout(conectarBaseDatos, 5000);
    }
}

async function crearTablas() {
    try {
        const request = pool.request();
        await request.query(`
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
            END
        `);
        console.log('✅ Tablas verificadas/creadas');
    } catch (error) {
        console.error('❌ Error creando tablas:', error.message);
    }
}

function validarDatos(datos, campos) {
    const errores = [];
    for (const campo of campos) {
        if (!datos[campo] || datos[campo].trim() === '') {
            errores.push(`El campo "${campo}" es requerido`);
        }
    }
    return errores;
}

function respuestaExito(res, datos, mensaje = 'Operación exitosa', codigo = 200) {
    res.status(codigo).json({
        éxito: true,
        mensaje,
        datos
    });
}

function respuestaError(res, mensaje, codigo = 400) {
    res.status(codigo).json({
        éxito: false,
        error: mensaje
    });
}

app.get('/api/health', (req, res) => {
    respuestaExito(res, {
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }, 'Servidor funcionando correctamente');
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { nombre, usuario, contraseña, fondo } = req.body;
        const errores = validarDatos(req.body, ['nombre', 'usuario', 'contraseña']);
        if (errores.length > 0) {
            return respuestaError(res, errores.join(', '));
        }
        if (usuario.length < 3) {
            return respuestaError(res, 'El usuario debe tener al menos 3 caracteres');
        }
        if (contraseña.length < 6) {
            return respuestaError(res, 'La contraseña debe tener al menos 6 caracteres');
        }
        const uuid = uuidv4();
        const fondoColor = fondo || '#3498db';
        const request = pool.request();
        request.input('uuid', sql.VarChar(36), uuid);
        request.input('nombre', sql.VarChar(100), nombre.trim());
        request.input('usuario', sql.VarChar(50), usuario.trim());
        request.input('contraseña', sql.VarChar(100), contraseña);
        request.input('fondo', sql.VarChar(255), fondoColor);
        const result = await request.query(`
            INSERT INTO usuarios (uuid, nombre, usuario, contraseña, fondo)
            VALUES (@uuid, @nombre, @usuario, @contraseña, @fondo);
            
            SELECT id, uuid, nombre, usuario, fondo, fechaRegistro
            FROM usuarios
            WHERE uuid = @uuid
        `);
        const usuarioCreado = result.recordset[0];
        respuestaExito(res, {
            uuid: usuarioCreado.uuid,
            nombre: usuarioCreado.nombre,
            usuario: usuarioCreado.usuario,
            fondo: usuarioCreado.fondo
        }, 'Usuario registrado exitosamente', 201);
    } catch (error) {
        if (error.message.includes('Violation of UNIQUE KEY constraint')) {
            return respuestaError(res, 'El nombre de usuario ya está en uso', 409);
        }
        console.error('Error en registro:', error.message);
        respuestaError(res, 'Error en el registro: ' + error.message, 500);
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        const errores = validarDatos(req.body, ['usuario', 'contraseña']);
        if (errores.length > 0) {
            return respuestaError(res, errores.join(', '));
        }
        const request = pool.request();
        request.input('usuario', sql.VarChar(50), usuario.trim());
        request.input('contraseña', sql.VarChar(100), contraseña);
        const result = await request.query(`
            SELECT id, uuid, nombre, usuario, fondo, fechaRegistro
            FROM usuarios
            WHERE usuario = @usuario AND contraseña = @contraseña
        `);
        if (result.recordset.length === 0) {
            return respuestaError(res, 'Usuario o contraseña incorrectos', 401);
        }
        const usuarioEncontrado = result.recordset[0];
        respuestaExito(res, {
            uuid: usuarioEncontrado.uuid,
            nombre: usuarioEncontrado.nombre,
            usuario: usuarioEncontrado.usuario,
            fondo: usuarioEncontrado.fondo,
            fechaRegistro: usuarioEncontrado.fechaRegistro
        }, 'Sesión iniciada correctamente');
    } catch (error) {
        console.error('Error en login:', error.message);
        respuestaError(res, 'Error en el login: ' + error.message, 500);
    }
});

app.get('/api/usuarios/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        if (!uuid) {
            return respuestaError(res, 'UUID es requerido');
        }
        const request = pool.request();
        request.input('uuid', sql.VarChar(36), uuid);
        const result = await request.query(`
            SELECT id, uuid, nombre, usuario, fondo, fechaRegistro, fechaActualizacion
            FROM usuarios
            WHERE uuid = @uuid
        `);
        if (result.recordset.length === 0) {
            return respuestaError(res, 'Usuario no encontrado', 404);
        }
        respuestaExito(res, result.recordset[0], 'Usuario obtenido correctamente');
    } catch (error) {
        console.error('Error obteniendo usuario:', error.message);
        respuestaError(res, 'Error obteniendo usuario: ' + error.message, 500);
    }
});

app.put('/api/usuarios/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const { nombre, contraseña, fondo } = req.body;
        if (!uuid) {
            return respuestaError(res, 'UUID es requerido');
        }
        const actualizaciones = [];
        const request = pool.request();
        request.input('uuid', sql.VarChar(36), uuid);
        if (nombre) {
            actualizaciones.push('nombre = @nombre');
            request.input('nombre', sql.VarChar(100), nombre.trim());
        }
        if (contraseña) {
            actualizaciones.push('contraseña = @contraseña');
            request.input('contraseña', sql.VarChar(100), contraseña);
        }
        if (fondo) {
            actualizaciones.push('fondo = @fondo');
            request.input('fondo', sql.VarChar(255), fondo);
        }
        if (actualizaciones.length === 0) {
            return respuestaError(res, 'No hay datos para actualizar');
        }
        actualizaciones.push('fechaActualizacion = GETUTCDATE()');
        const query = `
            UPDATE usuarios
            SET ${actualizaciones.join(', ')}
            WHERE uuid = @uuid;
            
            SELECT id, uuid, nombre, usuario, fondo, fechaRegistro, fechaActualizacion
            FROM usuarios
            WHERE uuid = @uuid
        `;
        const result = await request.query(query);
        if (result.recordset.length === 0) {
            return respuestaError(res, 'Usuario no encontrado', 404);
        }
        respuestaExito(res, result.recordset[0], 'Usuario actualizado correctamente');
    } catch (error) {
        console.error('Error actualizando usuario:', error.message);
        respuestaError(res, 'Error actualizando usuario: ' + error.message, 500);
    }
});

app.delete('/api/usuarios/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        if (!uuid) {
            return respuestaError(res, 'UUID es requerido');
        }
        const request = pool.request();
        request.input('uuid', sql.VarChar(36), uuid);
        const resultAntes = await request.query(`
            SELECT * FROM usuarios WHERE uuid = @uuid
        `);
        if (resultAntes.recordset.length === 0) {
            return respuestaError(res, 'Usuario no encontrado', 404);
        }
        await request.query(`DELETE FROM usuarios WHERE uuid = @uuid`);
        respuestaExito(res, {
            uuid,
            mensaje: 'Usuario eliminado correctamente'
        }, 'Usuario eliminado', 200);
    } catch (error) {
        console.error('Error eliminando usuario:', error.message);
        respuestaError(res, 'Error eliminando usuario: ' + error.message, 500);
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query('SELECT id, uuid, nombre, usuario, fondo FROM usuarios');
        respuestaExito(res, result.recordset, `${result.recordset.length} usuarios encontrados`);
    } catch (error) {
        console.error('Error listando usuarios:', error.message);
        respuestaError(res, 'Error listando usuarios: ' + error.message, 500);
    }
});

app.use((req, res) => {
    res.status(404).json({
        éxito: false,
        error: 'Ruta no encontrada: ' + req.method + ' ' + req.path
    });
});

app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        éxito: false,
        error: 'Error interno del servidor'
    });
});

async function iniciarServidor() {
    if (!process.env.DB_SERVER || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
        console.error('❌ ERROR: Falta configuración de base de datos en .env');
        console.error('   Asegúrate de tener:');
        console.error('   - DB_SERVER');
        console.error('   - DB_NAME');
        console.error('   - DB_USER');
        console.error('   - DB_PASSWORD');
        process.exit(1);
    }
    await conectarBaseDatos();
    app.listen(PORT, () => {
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🚀 SERVIDOR BACKEND ACTIVO');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`📡 Puerto: ${PORT}`);
        console.log(`🌐 Base de datos: ${process.env.DB_NAME}`);
        console.log(`🔌 Servidor: ${process.env.DB_SERVER}`);
        console.log('');
        console.log('ENDPOINTS DISPONIBLES:');
        console.log('  POST   http://localhost:' + PORT + '/api/auth/register');
        console.log('  POST   http://localhost:' + PORT + '/api/auth/login');
        console.log('  GET    http://localhost:' + PORT + '/api/usuarios/:uuid');
        console.log('  PUT    http://localhost:' + PORT + '/api/usuarios/:uuid');
        console.log('  DELETE http://localhost:' + PORT + '/api/usuarios/:uuid');
        console.log('  GET    http://localhost:' + PORT + '/api/health');
        console.log('');
        console.log('PRUEBA EL SERVIDOR:');
        console.log('  curl http://localhost:' + PORT + '/api/health');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');
    });
}

iniciarServidor().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('\n⛔ Cerrando servidor...');
    if (pool) {
        await pool.close();
    }
    process.exit(0);
});

module.exports = app;