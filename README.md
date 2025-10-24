# Frontend Admin Panel - Sistema de Protección del Analizador

Panel de administración web para gestionar los códigos de activación del analizador.

## Características

- Login con autenticación
- Dashboard con control global
- Gestión de códigos de activación
- Interfaz profesional con tema azul
- Diseño responsive

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.local.example .env.local
# Editar .env.local con la URL del backend
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Abrir en navegador:
```
http://localhost:3071
```

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3070/api
```

## Uso

1. Asegúrate de que el backend esté ejecutándose
2. Accede a `http://localhost:3000`
3. Login con credenciales por defecto: `admin` / `admin123`
4. Gestiona códigos y configuración global

## Funcionalidades

### Dashboard
- Toggle global para desactivar todos los analizadores
- Generar nuevos códigos de activación
- Tabla con todos los códigos y su estado
- Activar/desactivar códigos individuales
- Eliminar códigos

### Códigos de Activación
- Formato: XXXX-XXXX-XXXX-XXXX
- Se pueden usar múltiples veces
- Estado individual (activo/inactivo)
- Contador de usos
- Fecha de creación