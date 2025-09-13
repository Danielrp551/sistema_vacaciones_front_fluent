// ============================================================================
// SERVICIO DE GESTIÓN DE PERMISOS
// ============================================================================
// Este archivo contiene la lógica de negocio y orquestación para la gestión
// de permisos, actuando como intermediario entre el controlador y la API
// ============================================================================

import * as PermisosAPI from '../api/permisosAdmin';
import type {
  PermisosQueryObject,
  PermisosAdminResponse,
  Permiso,
  CreatePermisoDto,
  UpdatePermisoDto,
  PermisosEstadisticas
} from '../types/permisos';

// ============================================================================
// SERVICIO PRINCIPAL DE GESTIÓN DE PERMISOS
// ============================================================================

export class GestionPermisosService {
  /**
   * Obtiene lista paginada de permisos con filtros aplicados
   */
  static async getPermisos(query: PermisosQueryObject): Promise<PermisosAdminResponse> {
    try {
      return await PermisosAPI.getPermisos(query);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw new Error('No se pudieron cargar los permisos. Intente nuevamente.');
    }
  }

  /**
   * Obtiene un permiso específico por ID
   */
  static async getPermisoById(id: string): Promise<Permiso> {
    try {
      return await PermisosAPI.getPermisoById(id);
    } catch (error) {
      console.error('Error al obtener permiso:', error);
      throw new Error('No se pudo cargar el permiso solicitado.');
    }
  }

  /**
   * Crea un nuevo permiso
   */
  static async createPermiso(permiso: CreatePermisoDto): Promise<Permiso> {
    try {
      // Validaciones de negocio
      this.validatePermiso(permiso);
      
      return await PermisosAPI.createPermiso(permiso);
    } catch (error) {
      console.error('Error al crear permiso:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No se pudo crear el permiso. Intente nuevamente.');
    }
  }

  /**
   * Actualiza un permiso existente
   */
  static async updatePermiso(id: string, permiso: UpdatePermisoDto): Promise<Permiso> {
    try {
      // Validaciones de negocio
      this.validatePermiso(permiso);
      
      return await PermisosAPI.updatePermiso(id, permiso);
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No se pudo actualizar el permiso. Intente nuevamente.');
    }
  }

  /**
   * Elimina un permiso
   */
  static async deletePermiso(id: string): Promise<void> {
    try {
      await PermisosAPI.deletePermiso(id);
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      throw new Error('No se pudo eliminar el permiso. Intente nuevamente.');
    }
  }

  /**
   * Obtiene estadísticas de permisos
   */
  static async getEstadisticas(): Promise<PermisosEstadisticas> {
    try {
      return await PermisosAPI.getEstadisticas();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('No se pudieron cargar las estadísticas.');
    }
  }

  // ========================================================================
  // MÉTODOS DE VALIDACIÓN PRIVADOS
  // ========================================================================

  /**
   * Valida los datos de un permiso antes de enviarlos al servidor
   */
  private static validatePermiso(permiso: CreatePermisoDto | UpdatePermisoDto): void {
    if (!permiso.nombre?.trim()) {
      throw new Error('El nombre del permiso es requerido');
    }

    if (permiso.nombre.trim().length < 3) {
      throw new Error('El nombre del permiso debe tener al menos 3 caracteres');
    }

    if (permiso.nombre.trim().length > 100) {
      throw new Error('El nombre del permiso no puede exceder 100 caracteres');
    }

    if (!permiso.modulo?.trim()) {
      throw new Error('El módulo es requerido');
    }

    if (permiso.descripcion && permiso.descripcion.length > 500) {
      throw new Error('La descripción no puede exceder 500 caracteres');
    }
  }

  // ========================================================================
  // MÉTODOS DE UTILIDAD
  // ========================================================================

  /**
   * Formatea los datos de un permiso para mostrar en la interfaz
   */
  static formatPermisoForDisplay(permiso: Permiso): Permiso {
    return {
      ...permiso,
      nombre: permiso.nombre?.trim() || '',
      modulo: permiso.modulo?.trim() || '',
      descripcion: permiso.descripcion?.trim() || '',
    };
  }

  /**
   * Genera mensaje de confirmación para eliminación
   */
  static getDeleteConfirmationMessage(permiso: Permiso): string {
    return `¿Está seguro que desea eliminar el permiso "${permiso.nombre}"? Esta acción no se puede deshacer.`;
  }

  /**
   * Genera mensaje de éxito para operaciones CRUD
   */
  static getSuccessMessage(operation: 'create' | 'update' | 'delete', permisoNombre: string): string {
    const messages = {
      create: `Permiso "${permisoNombre}" creado exitosamente`,
      update: `Permiso "${permisoNombre}" actualizado exitosamente`,
      delete: `Permiso "${permisoNombre}" eliminado exitosamente`
    };

    return messages[operation];
  }
}
