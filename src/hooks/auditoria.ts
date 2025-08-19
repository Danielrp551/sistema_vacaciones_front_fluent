// ============================================================================
// EXPORTS DE HOOKS DE AUDITORÍA
// ============================================================================

// Hook principal
export {
  useAuditoria,
  useAuditoriaGestionUsuarios,
  useEstadisticasAuditoria
} from './useAuditoria';

// Hooks auxiliares
export {
  useAuditoriaDetalle,
  useAccionesRecientes
} from './useAuditoriaHelpers';

// Re-exportar tipos útiles
export type {
  UseAuditoriaState,
  UseAuditoriaActions,
  UseAuditoriaOptions,
  UseAuditoriaReturn
} from './useAuditoria';

export type {
  UseAuditoriaDetalleReturn,
  UseAccionesRecientesReturn
} from './useAuditoriaHelpers';
