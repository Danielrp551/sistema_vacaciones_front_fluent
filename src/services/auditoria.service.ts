import axiosInstance from './axiosInstance';
import type {
  AuditoriaCompleta,
  AuditoriaSimplePaginada,
  AuditoriaCompletaPaginada,
  FiltrosAuditoria,
  EstadisticasAuditoria,
  ModuloSistemaType
} from '../types/auditoria';

// ============================================================================
// SERVICE PARA GESTIÓN DE AUDITORÍA
// ============================================================================

class AuditoriaService {
  private readonly baseUrl = '/api/auditoria';

  // ===== MÉTODOS PRINCIPALES =====

  /**
   * Obtiene el historial de auditoría con filtros
   */
  async obtenerHistorial(filtros: FiltrosAuditoria = {}): Promise<AuditoriaCompletaPaginada> {
    const params = this.construirParametrosConsulta(filtros);
    const response = await axiosInstance.get<AuditoriaCompletaPaginada>(this.baseUrl, { params });
    return response.data;
  }

  /**
   * Obtiene un registro de auditoría específico por ID
   */
  async obtenerPorId(id: string): Promise<AuditoriaCompleta> {
    const response = await axiosInstance.get<AuditoriaCompleta>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ===== MÉTODOS ESPECÍFICOS PARA GESTIÓN DE USUARIOS =====

  /**
   * Obtiene el historial completo de gestión de usuarios
   */
  async obtenerHistorialGestionUsuarios(filtros: FiltrosAuditoria = {}): Promise<AuditoriaCompletaPaginada> {
    const params = this.construirParametrosConsulta(filtros);
    const response = await axiosInstance.get<AuditoriaCompletaPaginada>(
      `${this.baseUrl}/gestion-usuarios`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtiene el historial simplificado de gestión de usuarios (optimizado para UI)
   */
  async obtenerHistorialGestionUsuariosSimple(
    pagina: number = 1,
    tamanoPagina: number = 15,
    usuarioId?: string
  ): Promise<AuditoriaSimplePaginada> {
    const params: any = {
      pagina,
      tamanoPagina
    };

    if (usuarioId) {
      params.usuarioId = usuarioId;
    }

    const response = await axiosInstance.get<AuditoriaSimplePaginada>(
      `${this.baseUrl}/gestion-usuarios/simple`,
      { params }
    );
    return response.data;
  }

  // ===== MÉTODOS POR USUARIO =====

  /**
   * Obtiene el historial de acciones de un usuario específico
   */
  async obtenerHistorialPorUsuario(
    usuarioId: string,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Promise<AuditoriaCompletaPaginada> {
    const response = await axiosInstance.get<AuditoriaCompletaPaginada>(
      `${this.baseUrl}/usuario/${usuarioId}`,
      {
        params: { pagina, tamanoPagina }
      }
    );
    return response.data;
  }

  /**
   * Obtiene las acciones recientes de un usuario específico
   */
  async obtenerAccionesRecientesUsuario(
    usuarioId: string,
    limite: number = 10
  ): Promise<AuditoriaCompleta[]> {
    const response = await axiosInstance.get<AuditoriaCompleta[]>(
      `${this.baseUrl}/usuario/${usuarioId}/recientes`,
      {
        params: { limite }
      }
    );
    return response.data;
  }

  // ===== MÉTODOS DE ESTADÍSTICAS =====

  /**
   * Obtiene estadísticas generales de auditoría
   */
  async obtenerEstadisticas(
    fechaDesde?: Date,
    fechaHasta?: Date
  ): Promise<EstadisticasAuditoria> {
    const params: any = {};

    if (fechaDesde) {
      params.fechaDesde = fechaDesde.toISOString();
    }
    if (fechaHasta) {
      params.fechaHasta = fechaHasta.toISOString();
    }

    const response = await axiosInstance.get<EstadisticasAuditoria>(
      `${this.baseUrl}/estadisticas`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtiene resumen de actividad diaria
   */
  async obtenerResumenDiario(
    fechaDesde?: Date,
    fechaHasta?: Date
  ): Promise<Record<string, number>> {
    const params: any = {};

    if (fechaDesde) {
      params.fechaDesde = fechaDesde.toISOString();
    }
    if (fechaHasta) {
      params.fechaHasta = fechaHasta.toISOString();
    }

    const response = await axiosInstance.get<Record<string, number>>(
      `${this.baseUrl}/estadisticas/resumen-diario`,
      { params }
    );
    return response.data;
  }

  // ===== MÉTODOS POR MÓDULO =====

  /**
   * Obtiene historial de un módulo específico
   */
  async obtenerHistorialPorModulo(
    modulo: ModuloSistemaType,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Promise<AuditoriaCompletaPaginada> {
    const response = await axiosInstance.get<AuditoriaCompletaPaginada>(
      `${this.baseUrl}/modulo/${modulo}`,
      {
        params: { pagina, tamanoPagina }
      }
    );
    return response.data;
  }

  // ===== MÉTODOS UTILITARIOS =====

  /**
   * Construye los parámetros de consulta para la API
   */
  private construirParametrosConsulta(filtros: FiltrosAuditoria): Record<string, any> {
    const params: Record<string, any> = {};

    // Paginación
    if (filtros.pagina !== undefined) {
      params.pagina = filtros.pagina;
    }
    if (filtros.tamanoPagina !== undefined) {
      params.tamanoPagina = filtros.tamanoPagina;
    }

    // Filtros básicos
    if (filtros.usuarioId) {
      params.usuarioId = filtros.usuarioId;
    }
    if (filtros.tipoAccion) {
      params.tipoAccion = filtros.tipoAccion;
    }
    if (filtros.modulo) {
      params.modulo = filtros.modulo;
    }
    if (filtros.severidad) {
      params.severidad = filtros.severidad;
    }

    // Filtros de fecha
    if (filtros.fechaDesde) {
      params.fechaDesde = filtros.fechaDesde.toISOString();
    }
    if (filtros.fechaHasta) {
      params.fechaHasta = filtros.fechaHasta.toISOString();
    }

    // Ordenamiento
    if (filtros.ordenarPor) {
      params.ordenarPor = filtros.ordenarPor;
    }
    if (filtros.ordenDescendente !== undefined) {
      params.ordenDescendente = filtros.ordenDescendente;
    }

    return params;
  }

  /**
   * Formatea una fecha para mostrar en la UI
   */
  formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene el color asociado a una severidad para la UI
   */
  obtenerColorSeveridad(severidad: string): string {
    switch (severidad) {
      case 'INFO':
        return 'blue';
      case 'WARNING':
        return 'orange';
      case 'ERROR':
        return 'red';
      case 'SECURITY':
        return 'purple';
      case 'CRITICAL':
        return 'red';
      default:
        return 'gray';
    }
  }

  /**
   * Obtiene una descripción legible de la severidad
   */
  obtenerDescripcionSeveridad(severidad: string): string {
    switch (severidad) {
      case 'INFO':
        return 'Información';
      case 'WARNING':
        return 'Advertencia';
      case 'ERROR':
        return 'Error';
      case 'SECURITY':
        return 'Seguridad';
      case 'CRITICAL':
        return 'Crítico';
      default:
        return severidad;
    }
  }
}

// Crear y exportar una instancia del servicio
const auditoriaService = new AuditoriaService();
export default auditoriaService;

// También exportar la clase para testing
export { AuditoriaService };
