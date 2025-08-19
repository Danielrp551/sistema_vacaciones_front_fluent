// Funciones helper reutilizables para las tablas

/**
 * Obtiene el color correspondiente a un estado de solicitud
 */
export const getEstadoColor = (estado: string): string => {
  switch (estado?.toLowerCase()) {
    case 'pendiente':
      return '#d83b01'; // Orange
    case 'aprobado':
    case 'aprobada':
      return '#107c10'; // Green
    case 'rechazado':
    case 'rechazada':
      return '#d13438'; // Red
    case 'cancelado':
    case 'cancelada':
      return '#605e5c'; // Gray
    default:
      return '#323130'; // Default
  }
};

/**
 * Formatea una fecha en formato legible español
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Formatea una fecha y hora en formato legible español
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};
