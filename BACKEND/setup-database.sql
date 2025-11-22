-- ═══════════════════════════════════════════════════════════════════════════════
-- SCRIPT SQL PARA AZURE SQL DATABASE
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- CÓMO USAR:
-- 1. Ve a Azure Portal
-- 2. SQL Database → Query Editor
-- 3. Pega este script completo
-- 4. Ejecuta
--
-- RESULTADO:
-- Se crean todas las tablas necesarias para la aplicación
--

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. CREAR TABLA USUARIOS
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

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. CREAR TABLA CALIFICACIONES (opcional - para expandir)
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='calificaciones' AND xtype='U')
BEGIN
    CREATE TABLE calificaciones (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT NOT NULL,
        asignatura VARCHAR(100) NOT NULL,
        calificacion DECIMAL(3,2),
        semestre INT,
        fechaRegistro DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_usuarioId ON calificaciones(usuarioId);

    PRINT 'Tabla calificaciones creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla calificaciones ya existe';
END;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. CREAR TABLA HORARIO (opcional - para expandir)
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='horario' AND xtype='U')
BEGIN
    CREATE TABLE horario (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT NOT NULL,
        dia VARCHAR(20) NOT NULL,
        horaInicio TIME,
        horaFin TIME,
        asignatura VARCHAR(100),
        salon VARCHAR(50),
        fechaRegistro DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_usuarioId_horario ON horario(usuarioId);

    PRINT 'Tabla horario creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla horario ya existe';
END;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. CREAR TABLA AUDITORÍA (para tracking)
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='auditoria' AND xtype='U')
BEGIN
    CREATE TABLE auditoria (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuarioId INT,
        operacion VARCHAR(50),
        detalles VARCHAR(500),
        direccionIP VARCHAR(50),
        fechaRegistro DATETIME DEFAULT GETUTCDATE(),
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL
    );

    CREATE INDEX idx_usuarioId_audit ON auditoria(usuarioId);
    CREATE INDEX idx_fecha_audit ON auditoria(fechaRegistro);

    PRINT 'Tabla auditoria creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla auditoria ya existe';
END;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. VERIFICAR TABLAS CREADAS
-- ═══════════════════════════════════════════════════════════════════════════════

PRINT '';
PRINT '═══════════════════════════════════════════════════════════════════';
PRINT 'TABLAS CREADAS:';
PRINT '═══════════════════════════════════════════════════════════════════';

SELECT name AS 'Nombre de Tabla', 
       crdate AS 'Fecha de Creación'
FROM sysobjects 
WHERE xtype='U' AND name IN ('usuarios', 'calificaciones', 'horario', 'auditoria')
ORDER BY crdate;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. INSERTAR DATOS DE PRUEBA (opcional)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Descomenta para insertar usuario de prueba
/*
INSERT INTO usuarios (uuid, nombre, usuario, contraseña, fondo)
VALUES ('test-uuid-001', 'Juan Pérez', 'juan', '123456', '#3498db');

INSERT INTO usuarios (uuid, nombre, usuario, contraseña, fondo)
VALUES ('test-uuid-002', 'María García', 'maria', '123456', '#e74c3c');

SELECT * FROM usuarios;
*/

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. PROCEDIMIENTOS ALMACENADOS (OPCIONAL - para seguridad)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Procedimiento para obtener usuario por UUID
IF EXISTS (SELECT * FROM sys.procedures WHERE name='sp_ObtenerUsuario')
    DROP PROCEDURE sp_ObtenerUsuario;
GO

CREATE PROCEDURE sp_ObtenerUsuario
    @uuid VARCHAR(36)
AS
BEGIN
    SELECT id, uuid, nombre, usuario, fondo, fechaRegistro, fechaActualizacion
    FROM usuarios
    WHERE uuid = @uuid;
END;
GO

-- Procedimiento para obtener usuario por credenciales
IF EXISTS (SELECT * FROM sys.procedures WHERE name='sp_VerificarLogin')
    DROP PROCEDURE sp_VerificarLogin;
GO

CREATE PROCEDURE sp_VerificarLogin
    @usuario VARCHAR(50),
    @contraseña VARCHAR(100)
AS
BEGIN
    SELECT id, uuid, nombre, usuario, fondo, fechaRegistro
    FROM usuarios
    WHERE usuario = @usuario AND contraseña = @contraseña;
END;
GO

-- Procedimiento para insertar usuario
IF EXISTS (SELECT * FROM sys.procedures WHERE name='sp_CrearUsuario')
    DROP PROCEDURE sp_CrearUsuario;
GO

CREATE PROCEDURE sp_CrearUsuario
    @uuid VARCHAR(36),
    @nombre VARCHAR(100),
    @usuario VARCHAR(50),
    @contraseña VARCHAR(100),
    @fondo VARCHAR(255)
AS
BEGIN
    INSERT INTO usuarios (uuid, nombre, usuario, contraseña, fondo)
    VALUES (@uuid, @nombre, @usuario, @contraseña, @fondo);
    
    SELECT id, uuid, nombre, usuario, fondo, fechaRegistro
    FROM usuarios
    WHERE uuid = @uuid;
END;
GO

-- Procedimiento para actualizar usuario
IF EXISTS (SELECT * FROM sys.procedures WHERE name='sp_ActualizarUsuario')
    DROP PROCEDURE sp_ActualizarUsuario;
GO

CREATE PROCEDURE sp_ActualizarUsuario
    @uuid VARCHAR(36),
    @nombre VARCHAR(100),
    @contraseña VARCHAR(100),
    @fondo VARCHAR(255)
AS
BEGIN
    UPDATE usuarios
    SET nombre = @nombre,
        contraseña = @contraseña,
        fondo = @fondo,
        fechaActualizacion = GETUTCDATE()
    WHERE uuid = @uuid;
    
    SELECT id, uuid, nombre, usuario, fondo, fechaRegistro, fechaActualizacion
    FROM usuarios
    WHERE uuid = @uuid;
END;
GO

PRINT '';
PRINT '═══════════════════════════════════════════════════════════════════';
PRINT 'PROCEDIMIENTOS ALMACENADOS CREADOS:';
PRINT '═══════════════════════════════════════════════════════════════════';
PRINT '✓ sp_ObtenerUsuario';
PRINT '✓ sp_VerificarLogin';
PRINT '✓ sp_CrearUsuario';
PRINT '✓ sp_ActualizarUsuario';
PRINT '';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 8. INFORMACIÓN FINAL
-- ═══════════════════════════════════════════════════════════════════════════════

PRINT '═══════════════════════════════════════════════════════════════════';
PRINT '✅ BASE DE DATOS CONFIGURADA CORRECTAMENTE';
PRINT '═══════════════════════════════════════════════════════════════════';
PRINT '';
PRINT 'TABLAS DISPONIBLES:';
PRINT '  • usuarios - Almacena usuarios de la aplicación';
PRINT '  • calificaciones - Almacena calificaciones (opcional)';
PRINT '  • horario - Almacena horarios (opcional)';
PRINT '  • auditoria - Registra operaciones';
PRINT '';
PRINT 'PRÓXIMOS PASOS:';
PRINT '  1. Instala backend (npm install)';
PRINT '  2. Configura .env con credenciales';
PRINT '  3. Inicia backend (node backend-server.js)';
PRINT '  4. Conecta aplicación al API';
PRINT '  5. Prueba registro y login';
PRINT '';
