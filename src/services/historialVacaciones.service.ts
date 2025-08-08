import { axiosInstance } from '../api/axios';

export interface HistorialVacacionesDto {
  periodo: number;
  vencidas: number;
  pendientes: number;
  truncas: number;
  diasLibres: number;
  diasBloque: number;
}

export interface HistorialVacacionesResponse {
  usuarioId: number;
  fechaIngreso: string;
  historial: HistorialVacacionesDto[];
}

export const HistorialVacacionesService = {
  async getHistorial(): Promise<HistorialVacacionesResponse> {
    const response = await axiosInstance.get<HistorialVacacionesResponse>(
      'historial-vacaciones'
    );
    return response.data;
  }
};
