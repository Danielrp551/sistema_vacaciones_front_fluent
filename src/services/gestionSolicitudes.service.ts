import { axiosInstance } from '../api/axios';
import type { SolicitudVacacionesDetailDto, SolicitudesQueryObject } from './solicitudVacaciones.service';

export interface GestionSolicitudesQueryObject extends SolicitudesQueryObject {
  empleadoId?: string;
  incluirSubordinadosNivelN?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  fechaInicioRango?: string; // Para filtro de rango de fecha de inicio
  fechaFinRango?: string;    // Para filtro de rango de fecha de fin
}

export interface GestionSolicitudesResponse {
  total: number;  // Total de la página actual
  totalCompleto: number;  // Total completo sin paginación para calcular páginas
  solicitudes: SolicitudVacacionesDetailDto[];
  supervisor: string;
  pagina: number;
  tamanoPagina: number;
  estadisticas: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    canceladas: number;
  };
}

export interface EmpleadoDto {
  id: string;
  nombreCompleto: string;
  email: string;
  esDirecto: boolean;
}

export interface EmpleadosEquipoResponse {
  empleados: EmpleadoDto[];
  total: number;
  incluirSubordinadosNivelN: boolean;
}

export interface AprobarRechazarSolicitudRequest {
  accion: 'aprobar' | 'rechazar';
  comentarios?: string;
}

export interface AprobarRechazarSolicitudResponse {
  message: string;
  solicitudId: number;
  estado: string;
}

export const GestionSolicitudesService = {
  async getSolicitudesEquipo(queryObject?: GestionSolicitudesQueryObject): Promise<GestionSolicitudesResponse> {
    const params = new URLSearchParams();
    
    if (queryObject?.pageNumber) params.append('pageNumber', queryObject.pageNumber.toString());
    if (queryObject?.pageSize) params.append('pageSize', queryObject.pageSize.toString());
    if (queryObject?.estado) params.append('estado', queryObject.estado);
    if (queryObject?.periodo) params.append('periodo', queryObject.periodo.toString());
    if (queryObject?.tipoVacaciones) params.append('tipoVacaciones', queryObject.tipoVacaciones);
    if (queryObject?.empleadoId) params.append('empleadoId', queryObject.empleadoId);
    if (queryObject?.incluirSubordinadosNivelN !== undefined) {
      params.append('incluirSubordinadosNivelN', queryObject.incluirSubordinadosNivelN.toString());
    }
    if (queryObject?.fechaInicio) params.append('fechaInicio', queryObject.fechaInicio);
    if (queryObject?.fechaFin) params.append('fechaFin', queryObject.fechaFin);
    
    // Agregar parámetros de rango de fecha
    if (queryObject?.fechaInicioRango) params.append('fechaInicioRango', queryObject.fechaInicioRango);
    if (queryObject?.fechaFinRango) params.append('fechaFinRango', queryObject.fechaFinRango);

    const response = await axiosInstance.get<GestionSolicitudesResponse>(
      `solicitud-vacaciones/gestion-solicitudes?${params.toString()}`
    );
    return response.data;
  },

  async getEmpleadosEquipo(incluirSubordinadosNivelN: boolean = false): Promise<EmpleadosEquipoResponse> {
    const params = new URLSearchParams();
    params.append('incluirSubordinadosNivelN', incluirSubordinadosNivelN.toString());

    const response = await axiosInstance.get<EmpleadosEquipoResponse>(
      `solicitud-vacaciones/equipo-empleados?${params.toString()}`
    );
    return response.data;
  },

  async aprobarSolicitud(solicitudId: string, comentarios?: string): Promise<AprobarRechazarSolicitudResponse> {
    const response = await axiosInstance.put<AprobarRechazarSolicitudResponse>(
      `solicitud-vacaciones/${solicitudId}/aprobar`,
      { 
        accion: 'aprobar',
        comentarios: comentarios || ''
      }
    );
    return response.data;
  },

  async rechazarSolicitud(solicitudId: string, comentarios: string): Promise<AprobarRechazarSolicitudResponse> {
    const response = await axiosInstance.put<AprobarRechazarSolicitudResponse>(
      `solicitud-vacaciones/${solicitudId}/aprobar`,
      { 
        accion: 'rechazar',
        comentarios: comentarios
      }
    );
    return response.data;
  }
};
