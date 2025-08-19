import { axiosInstance } from '../api/axios';

export interface SaldoVacacionesDto {
  id: string;
  empleadoId: string;
  nombreEmpleado: string;
  periodo: number;
  diasVencidas: number;
  diasPendientes: number;
  diasTruncas: number;
  diasLibres: number;
  diasBloque: number;
  nombreManager: string;
  email: string;
}

export interface SaldosVacacionesQueryObject {
  pageNumber?: number;
  pageSize?: number;
  empleadoId?: string;
  periodo?: number;
  incluirSubordinadosNivelN?: boolean;
  sortBy?: string;
  isDescending?: boolean;
}

export interface SaldosVacacionesResponse {
  total: number;  // Total de la página actual
  totalCompleto: number;  // Total completo sin paginación para calcular páginas
  saldos: SaldoVacacionesDto[];
  supervisor: string;
  pagina: number;
  tamanoPagina: number;
  estadisticas: {
    totalEmpleados: number;
    totalDiasVencidas: number;
    totalDiasPendientes: number;
    totalDiasTruncas: number;
    totalDiasLibres: number;
    totalDiasBloque: number;
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

export interface SaldoVacacionesDetalleDto extends SaldoVacacionesDto {
  fechaCorte: string;
  fechaProximoCorte: string;
  detalleVencidas: {
    periodo: number;
    dias: number;
    fechaVencimiento: string;
  }[];
  detalleAcumulados: {
    tipoVacacion: string;
    diasAcumulados: number;
    diasUsados: number;
    diasDisponibles: number;
  }[];
}

export const SaldosVacacionesService = {
  async getSaldosVacaciones(queryObject?: SaldosVacacionesQueryObject): Promise<SaldosVacacionesResponse> {
    const params = new URLSearchParams();
    
    if (queryObject?.pageNumber) params.append('pageNumber', queryObject.pageNumber.toString());
    if (queryObject?.pageSize) params.append('pageSize', queryObject.pageSize.toString());
    if (queryObject?.empleadoId) params.append('empleadoId', queryObject.empleadoId);
    if (queryObject?.periodo) params.append('periodo', queryObject.periodo.toString());
    if (queryObject?.incluirSubordinadosNivelN !== undefined) {
      params.append('incluirSubordinadosNivelN', queryObject.incluirSubordinadosNivelN.toString());
    }

    // Agregar parámetros de ordenamiento
    if (queryObject?.sortBy) params.append('sortBy', queryObject.sortBy);
    if (queryObject?.isDescending !== undefined) params.append('isDescending', queryObject.isDescending.toString());

    const response = await axiosInstance.get<SaldosVacacionesResponse>(
      `historial-vacaciones/saldos-equipo?${params.toString()}`
    );
    return response.data;
  },

  async getEmpleadosEquipo(incluirSubordinadosNivelN: boolean = false): Promise<EmpleadosEquipoResponse> {
    const params = new URLSearchParams();
    params.append('incluirSubordinadosNivelN', incluirSubordinadosNivelN.toString());

    const response = await axiosInstance.get<EmpleadosEquipoResponse>(
      `historial-vacaciones/empleados-equipo?${params.toString()}`
    );
    return response.data;
  },

  async getSaldoVacacionesDetalle(saldoId: string): Promise<SaldoVacacionesDetalleDto> {
    // Este endpoint se puede implementar más tarde si es necesario
    // Por ahora retornamos una estructura básica
    const saldos = await this.getSaldosVacaciones();
    const saldo = saldos.saldos.find(s => s.id === saldoId);
    
    if (!saldo) {
      throw new Error('Saldo no encontrado');
    }

    return {
      ...saldo,
      fechaCorte: new Date().toISOString(),
      fechaProximoCorte: new Date().toISOString(),
      detalleVencidas: [],
      detalleAcumulados: []
    };
  }
};
