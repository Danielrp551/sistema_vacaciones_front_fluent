/**
 * Utilidades para manejo de ordenamiento en tablas
 */

/**
 * Mapeo de nombres de columnas del frontend a campos del backend
 */
export const COLUMN_TO_FIELD_MAP: Record<string, string> = {
  // Campos directos de SolicitudVacaciones - usar camelCase como espera el backend
  'id': 'id',
  'tipoVacaciones': 'tipoVacaciones',
  'fechaInicio': 'fechaInicio',
  'fechaFin': 'fechaFin',
  'diasSolicitados': 'diasSolicitados',
  'estado': 'estado',
  'fechaSolicitud': 'fechaSolicitud',
  'periodo': 'periodo',
  
  // Campos relacionados - necesitan navegación en Entity Framework
  'solicitante': 'Solicitante.Persona.Nombres',
  'nombreSolicitante': 'Solicitante.Persona.Nombres',
  'manager': 'Jefe.Persona.Nombres',
  'nombreJefeDirecto': 'Jefe.Persona.Nombres',
  'aprobadoPor': 'Aprobador.Persona.Nombres',
  'nombreAprobador': 'Aprobador.Persona.Nombres',
  'fechaGestion': 'fechaAprobacion',
  
  // Campos calculados o virtuales
  'diasRestantes': 'fechaSolicitud', // Fallback a fecha de solicitud
  
  // Campos de SaldosVacaciones
  'empleado': 'Empleado.Persona.Nombres',
  'nombreEmpleado': 'Empleado.Persona.Nombres',
  'diasVencidas': 'diasVencidas',
  'diasPendientes': 'diasPendientes', 
  'diasTruncas': 'diasTruncas',
  'diasLibres': 'diasLibres',
  'diasBloque': 'diasBloque',
  'managerSaldos': 'Manager.Persona.Nombres',
  'nombreManager': 'Manager.Persona.Nombres',
};

/**
 * Convierte el nombre de columna del frontend al campo correspondiente del backend
 * @param columnKey - Clave de la columna en el frontend
 * @returns El nombre del campo para ordenamiento en el backend
 */
export const mapColumnToField = (columnKey: string): string => {
  return COLUMN_TO_FIELD_MAP[columnKey] || 'fechaSolicitud'; // Default fallback
};

/**
 * Valida si una columna es ordenable
 * @param columnKey - Clave de la columna
 * @returns true si la columna es ordenable
 */
export const isColumnSortable = (columnKey: string): boolean => {
  return Object.keys(COLUMN_TO_FIELD_MAP).includes(columnKey);
};
