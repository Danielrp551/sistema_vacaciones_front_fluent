import { useState, useEffect } from 'react';
import { SolicitudVacacionesService } from '../../services/solicitudVacaciones.service';
import type { CreateSolicitudRequestDto } from '../../services/solicitudVacaciones.service';
import { HistorialVacacionesService } from '../../services/historialVacaciones.service';
import type { HistorialVacacionesDto } from '../../services/historialVacaciones.service';

interface VacationRequest {
  tipoVacaciones: string;
  diasSolicitados: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  observaciones: string;
}

export const useSolVacacionesController = () => {
  // Estados del formulario
  const [vacationRequest, setVacationRequest] = useState<VacationRequest>({
    tipoVacaciones: '',
    diasSolicitados: 0,
    fechaInicio: null,
    fechaFin: null,
    observaciones: '',
  });

  // Estados para opciones dinámicas
  const [selectedPeriod, setSelectedPeriod] = useState<HistorialVacacionesDto | null>(null);
  const [daysOptions, setDaysOptions] = useState<number[]>([]);

  // Estados para datos del backend
  const [historialData, setHistorialData] = useState<HistorialVacacionesDto[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Obtener la fecha mínima (hoy)
  const getMinDate = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparación exacta
    return today;
  };

  // Cargar historial al montar el componente
  useEffect(() => {
    loadHistorial();
  }, []);

  // Seleccionar el primer período disponible
  useEffect(() => {
    if (historialData.length > 0) {
      const sortedHistorial = [...historialData].sort((a, b) => a.periodo - b.periodo);
      const firstAvailable = sortedHistorial.find(
        (item) => item.diasLibres > 0 || item.diasBloque > 0
      );
      
      if (firstAvailable) {
        setSelectedPeriod(firstAvailable);
      } else {
        setSelectedPeriod(null);
      }
    }
  }, [historialData]);

  // Actualizar opciones de días según el tipo de vacación
  useEffect(() => {
    if (!selectedPeriod) {
      setDaysOptions([]);
      return;
    }

    const libresDisponibles = selectedPeriod.diasLibres;
    const bloquesDisponibles = selectedPeriod.diasBloque;

    if (vacationRequest.tipoVacaciones === 'libres') {
      const max = Math.floor(libresDisponibles);
      const arrayDias = [];
      for (let i = 1; i <= max; i++) {
        arrayDias.push(i);
      }
      setDaysOptions(arrayDias);
      // Reset días solicitados si el valor actual no está disponible
      if (vacationRequest.diasSolicitados > max) {
        setVacationRequest(prev => ({ ...prev, diasSolicitados: 0 }));
      }
    } else if (vacationRequest.tipoVacaciones === 'bloque') {
      const posiblesBloques = [7, 8, 15];
      const filtrados = posiblesBloques.filter((op) => op <= bloquesDisponibles);
      setDaysOptions(filtrados);
      // Reset días solicitados si el valor actual no está disponible
      if (!filtrados.includes(vacationRequest.diasSolicitados)) {
        setVacationRequest(prev => ({ ...prev, diasSolicitados: 0 }));
      }
    } else {
      setDaysOptions([]);
      setVacationRequest(prev => ({ ...prev, diasSolicitados: 0 }));
    }
  }, [vacationRequest.tipoVacaciones, selectedPeriod]);

  // Calcular fecha fin automáticamente
  useEffect(() => {
    if (vacationRequest.fechaInicio && vacationRequest.diasSolicitados > 0) {
      const fechaInicio = new Date(vacationRequest.fechaInicio);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + vacationRequest.diasSolicitados - 1);
      
      setVacationRequest(prev => ({
        ...prev,
        fechaFin: fechaFin,
      }));
    }
  }, [vacationRequest.fechaInicio, vacationRequest.diasSolicitados]);

  const loadHistorial = async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);
      const data = await HistorialVacacionesService.getHistorial();
      console.log('Historial data received:', data); // Debug log
      setHistorialData(data.historial || []);
    } catch (err: any) {
      console.error('Error loading historial:', err); // Debug log
      setError(err?.response?.data?.message || 'Error al cargar el historial de vacaciones');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleInputChange = (field: keyof VacationRequest, value: any) => {
    setVacationRequest(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Activar validaciones desde el primer intento de envío
    setShowValidation(true);
    
    if (!selectedPeriod) {
      setError('No hay períodos disponibles para solicitar vacaciones');
      return;
    }

    // Validaciones del formulario
    if (!vacationRequest.tipoVacaciones) {
      setError('Debe seleccionar un tipo de vacaciones');
      return;
    }

    if (!vacationRequest.diasSolicitados || vacationRequest.diasSolicitados <= 0) {
      setError('Debe seleccionar la cantidad de días solicitados');
      return;
    }

    if (!vacationRequest.fechaInicio) {
      setError('Debe seleccionar la fecha de inicio');
      return;
    }

    if (!vacationRequest.fechaFin) {
      setError('Error calculando la fecha de fin');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const solicitudPayload: CreateSolicitudRequestDto = {
        tipoVacaciones: vacationRequest.tipoVacaciones,
        diasSolicitados: vacationRequest.diasSolicitados,
        fechaInicio: vacationRequest.fechaInicio.toISOString().split('T')[0],
        fechaFin: vacationRequest.fechaFin.toISOString().split('T')[0],
        periodo: selectedPeriod.periodo,
        observaciones: vacationRequest.observaciones,
      };

      await SolicitudVacacionesService.crearSolicitud(solicitudPayload);
      
      // Solo mostrar mensaje de éxito sin el ID GUID
      setSuccessMessage('Solicitud de vacaciones enviada exitosamente');
      setShowSuccessNotification(true); // Mostrar notificación de éxito
      
      // Resetear formulario y validaciones
      setVacationRequest({
        tipoVacaciones: '',
        diasSolicitados: 0,
        fechaInicio: null,
        fechaFin: null,
        observaciones: '',
      });
      setShowValidation(false); // Resetear validaciones después del éxito

      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);

      // Recargar historial
      await loadHistorial();

    } catch (err: any) {
      console.error('Error submitting request:', err); // Debug log
      setError(err?.response?.data?.message || 'Error al crear la solicitud de vacaciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Estados del formulario
    vacationRequest,
    selectedPeriod,
    daysOptions,
    
    // Estados de carga y errores
    historialData,
    isLoadingHistory,
    isSubmitting,
    error,
    successMessage,
    showValidation,
    showSuccessNotification,
    
    // Funciones
    handleInputChange,
    handleSubmit,
    setError,
    setSuccessMessage,
    getMinDate,
    setShowSuccessNotification,
  };
};
