import { axiosInstance } from '../api/axios';

export interface CreateSolicitudRequestDto {
  tipoVacaciones: string; // "libres" o "bloque"
  diasSolicitados: number;
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  periodo: number; // 2020, 2021, 2022, etc.
  observaciones?: string; // Observaciones del solicitante (opcional)
}

export interface CreateSolicitudResponse {
  message: string;
  solicitudId: number;
}

export interface SolicitudVacacionesDto {
  id: string;
  usuarioId: string;
  tipoVacaciones: string; // "libres" o "bloque"
  diasSolicitados: number;
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  estado: string; // "pendiente", "aprobado", "rechazado", "cancelada"
  fechaSolicitud: string; // ISO date string
  periodo: number; // 2020, 2021, 2022, etc.
  diasFinde: number; // Cantidad de días de fin de semana en el rango de fechas
}

export interface SolicitudVacacionesDetailDto extends SolicitudVacacionesDto {
  nombreSolicitante: string;
  emailSolicitante: string;
  aprobadorId?: string;
  nombreAprobador?: string;
  jefeDirectoId?: string;
  nombreJefeDirecto?: string;
  fechaAprobacion?: string;
  comentarios: string; // Comentarios del aprobador
  observaciones: string; // Observaciones del solicitante
  puedeCancelar: boolean;
  puedeAprobar: boolean;
}

export interface MisSolicitudesResponse {
  total: number;
  solicitudes: SolicitudVacacionesDetailDto[];
  usuario: string;
  pagina: number;
  tamanoPagina: number;
}

export interface SolicitudesQueryObject {
  pageNumber?: number;
  pageSize?: number;
  estado?: string;
  periodo?: number;
  tipoVacaciones?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sortBy?: string;
  isDescending?: boolean;
}

export interface CancelarSolicitudRequestDto {
  MotivoCancelacion: string;
}

export const SolicitudVacacionesService = {
  async crearSolicitud(data: CreateSolicitudRequestDto): Promise<CreateSolicitudResponse> {
    const response = await axiosInstance.post<CreateSolicitudResponse>(
      'solicitud-vacaciones/crear-solicitud-vacaciones',
      data
    );
    return response.data;
  },

  async getMisSolicitudes(queryObject?: SolicitudesQueryObject): Promise<MisSolicitudesResponse> {
    const params = new URLSearchParams();
    
    if (queryObject?.pageNumber) params.append('pageNumber', queryObject.pageNumber.toString());
    if (queryObject?.pageSize) params.append('pageSize', queryObject.pageSize.toString());
    if (queryObject?.estado) params.append('estado', queryObject.estado);
    if (queryObject?.periodo) params.append('periodo', queryObject.periodo.toString());
    if (queryObject?.tipoVacaciones) params.append('tipoVacaciones', queryObject.tipoVacaciones);
    if (queryObject?.fechaInicio) params.append('fechaInicio', queryObject.fechaInicio);
    if (queryObject?.fechaFin) params.append('fechaFin', queryObject.fechaFin);
    
    // ✅ Agregar parámetros de ordenamiento que faltaban
    if (queryObject?.sortBy) params.append('sortBy', queryObject.sortBy);
    if (queryObject?.isDescending !== undefined) params.append('isDescending', queryObject.isDescending.toString());

    const response = await axiosInstance.get<MisSolicitudesResponse>(
      `solicitud-vacaciones/mis-solicitudes?${params.toString()}`
    );
    return response.data;
  },

  async getSolicitudDetail(solicitudId: string): Promise<SolicitudVacacionesDetailDto> {
    const response = await axiosInstance.get<SolicitudVacacionesDetailDto>(
      `solicitud-vacaciones/${solicitudId}`
    );
    return response.data;
  },

  async cancelarSolicitud(solicitudId: string, motivoCancelacion: string): Promise<{ message: string }> {
    const response = await axiosInstance.put<{ message: string }>(
      `solicitud-vacaciones/${solicitudId}/cancelar`,
      { MotivoCancelacion: motivoCancelacion }
    );
    return response.data;
  }
};
