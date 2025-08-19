import { useState, useCallback } from 'react';
import auditoriaService from '../services/auditoria.service';
import type { AuditoriaCompleta } from '../types/auditoria';

// ============================================================================
// HOOK SIMPLE PARA OBTENER DETALLES DE AUDITORÍA
// ============================================================================

export interface UseAuditoriaDetalleReturn {
  registro: AuditoriaCompleta | null;
  isLoading: boolean;
  error: string | null;
  obtenerDetalle: (id: string) => Promise<void>;
  limpiarDetalle: () => void;
  limpiarError: () => void;
}

/**
 * Hook simple para obtener y mostrar detalles de un registro de auditoría específico
 */
export function useAuditoriaDetalle(): UseAuditoriaDetalleReturn {
  const [registro, setRegistro] = useState<AuditoriaCompleta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerDetalle = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const resultado = await auditoriaService.obtenerPorId(id);
      setRegistro(resultado);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el detalle del registro');
      console.error('Error en useAuditoriaDetalle:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const limpiarDetalle = useCallback(() => {
    setRegistro(null);
    setError(null);
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    registro,
    isLoading,
    error,
    obtenerDetalle,
    limpiarDetalle,
    limpiarError
  };
}

// ============================================================================
// HOOK PARA ACCIONES RECIENTES DE UN USUARIO
// ============================================================================

export interface UseAccionesRecientesReturn {
  acciones: AuditoriaCompleta[];
  isLoading: boolean;
  error: string | null;
  cargarAcciones: (usuarioId: string, limite?: number) => Promise<void>;
  limpiarAcciones: () => void;
  limpiarError: () => void;
}

/**
 * Hook para obtener las acciones recientes de un usuario específico
 */
export function useAccionesRecientes(): UseAccionesRecientesReturn {
  const [acciones, setAcciones] = useState<AuditoriaCompleta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarAcciones = useCallback(async (usuarioId: string, limite: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const resultado = await auditoriaService.obtenerAccionesRecientesUsuario(usuarioId, limite);
      setAcciones(resultado);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las acciones recientes');
      console.error('Error en useAccionesRecientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const limpiarAcciones = useCallback(() => {
    setAcciones([]);
    setError(null);
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    acciones,
    isLoading,
    error,
    cargarAcciones,
    limpiarAcciones,
    limpiarError
  };
}
