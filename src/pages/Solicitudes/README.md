# Página de Solicitudes de Vacaciones

## Descripción

La página de **Solicitudes de Vacaciones** permite a los usuarios gestionar y visualizar todas sus solicitudes de vacaciones de manera completa y eficiente. Esta página implementa las mejores prácticas de desarrollo usando **Fluent UI** y **TypeScript**.

## Características Principales

### 🎯 Funcionalidades Core
- **Lista de solicitudes**: Visualización de todas las solicitudes del usuario con paginación
- **Filtros avanzados**: Filtrado por estado, tipo de vacaciones y período
- **Estadísticas en tiempo real**: Tarjetas con contadores por estado de solicitudes
- **Acciones sobre solicitudes**: Ver detalle y cancelar solicitudes pendientes
- **Navegación integrada**: Botón directo para crear nueva solicitud

### 📊 Estadísticas y Filtros
- Contadores por estado: Total, Pendientes, Aprobadas, Rechazadas, Canceladas
- Filtros dinámicos por:
  - Estado (Pendiente, Aprobado, Rechazado, Cancelado)
  - Tipo de vacaciones (Libres, Bloque)
  - Período (2024, 2025, 2026)

### 🎨 Interfaz de Usuario
- Diseño responsivo con **Fluent UI**
- Tabla interactiva con información detallada:
  - ID de solicitud
  - Tipo de vacaciones
  - Rango de fechas
  - Días solicitados
  - Estado con codificación por colores
  - Fecha de solicitud
  - Período
  - Acciones disponibles

### ⚡ Acciones Disponibles
- **Ver detalle**: Modal con información completa de la solicitud
- **Cancelar solicitud**: Solo para solicitudes pendientes, con motivo requerido
- **Crear nueva solicitud**: Redirección a `/solicitar-vacaciones`

## Estructura de Archivos

```
src/pages/Solicitudes/
├── Solicitudes.tsx              # Componente principal
├── Solicitudes.controller.ts    # Lógica de negocio y estado
├── Solicitudes.styles.ts        # Estilos con Fluent UI
└── index.ts                     # Exportaciones
```

## Integración con Backend

La página consume los siguientes endpoints del backend:

### GET `/api/solicitud-vacaciones/mis-solicitudes`
- Obtiene la lista paginada de solicitudes del usuario
- Soporta filtros por query parameters
- Retorna estadísticas agregadas

### GET `/api/solicitud-vacaciones/{solicitudId}`
- Obtiene el detalle completo de una solicitud específica
- Incluye permisos de usuario (puede cancelar, puede aprobar)

### PUT `/api/solicitud-vacaciones/{solicitudId}/cancelar`
- Cancela una solicitud pendiente
- Requiere motivo de cancelación

## Uso en la Aplicación

### Navegación
- Accesible desde el menú lateral: **"Mis Solicitudes"**
- Ruta: `/solicitudes`
- Ícono: `ClipboardList`

### Estados de Solicitud
- **🟠 Pendiente**: Solicitud enviada, esperando aprobación
- **🟢 Aprobado**: Solicitud aprobada por el supervisor
- **🔴 Rechazado**: Solicitud rechazada con comentarios
- **⚫ Cancelado**: Solicitud cancelada por el usuario

### Permisos y Seguridad
- Solo el propietario puede ver sus solicitudes
- Solo solicitudes pendientes pueden ser canceladas
- Autenticación requerida (token JWT)

## Mejores Prácticas Implementadas

### 🏗️ Arquitectura
- Separación de responsabilidades (UI, lógica, estilos)
- Hook personalizado para manejo de estado
- Types TypeScript estrictos
- Manejo de errores robusto

### 🎯 UX/UI
- Loading states durante las peticiones
- Mensajes de éxito y error claros
- Estados vacíos informativos
- Paginación intuitiva
- Filtros persistentes

### 🔒 Seguridad
- Validación de permisos en el frontend
- Manejo seguro de tokens
- Sanitización de datos de entrada

### 📱 Responsive Design
- Adaptable a diferentes tamaños de pantalla
- Grid flexible para las tarjetas de estadísticas
- Tabla responsive con scroll horizontal

## Ejemplo de Uso

```typescript
// Navegación programática
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/solicitudes');

// Desde el menú lateral
// El usuario hace clic en "Mis Solicitudes" y es redirigido automáticamente
```

## Próximas Mejoras

- [ ] Exportar solicitudes a PDF/Excel
- [ ] Notificaciones push para cambios de estado
- [ ] Historial de cambios en solicitudes
- [ ] Búsqueda por texto libre
- [ ] Filtros por rango de fechas personalizado
- [ ] Vista de calendario para solicitudes aprobadas

## Dependencias

- `@fluentui/react`: Componentes UI
- `react-router-dom`: Navegación
- `axios`: HTTP client (a través de axiosInstance)

## Integración con el Sistema

La página está completamente integrada con:
- Sistema de autenticación
- Layout principal de la aplicación
- Menú de navegación lateral
- Sistema de rutas protegidas
- Context de layout para sidebar
