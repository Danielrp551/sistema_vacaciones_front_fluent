import {
  Stack,
  Text,
  PrimaryButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Spinner,
  SpinnerSize,
  DatePicker,
  DayOfWeek,
  IconButton,
  TextField,
} from '@fluentui/react';
import type { IColumn, IDatePickerStrings } from '@fluentui/react';
import { useSolVacacionesController } from './SolVacaciones.controller';
import { styles } from './SolVacaciones.styles';
import type { HistorialVacacionesDto } from '../../services/historialVacaciones.service';

// Configuración de idioma español para DatePicker
const datePickerStrings: IDatePickerStrings = {
  months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  shortDays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  goToToday: 'Ir a hoy',
  weekNumberFormatString: 'Semana {0}',
  prevMonthAriaLabel: 'Mes anterior',
  nextMonthAriaLabel: 'Mes siguiente',
  prevYearAriaLabel: 'Año anterior',
  nextYearAriaLabel: 'Año siguiente',
  invalidInputErrorMessage: 'Formato de fecha inválido.',
};

const SolVacaciones = () => {
  const {
    vacationRequest,
    selectedPeriod,
    daysOptions,
    historialData,
    isLoadingHistory,
    isSubmitting,
    error,
    successMessage,
    showValidation,
    showSuccessNotification,
    handleInputChange,
    handleSubmit,
    setError,
    setSuccessMessage,
    getMinDate,
    setShowSuccessNotification,
  } = useSolVacacionesController();

  // Opciones para el dropdown de tipo de vacaciones
  const tipoVacacionesOptions = [
    { key: 'libres', text: 'Libres' },
    { key: 'bloque', text: 'Bloque' },
  ];

  // Opciones para el dropdown de días solicitados
  const diasSolicitadosOptions = daysOptions.map(day => ({
    key: day.toString(),
    text: day.toString(),
  }));

  // Configuración de columnas para la tabla de historial - Nueva implementación limpia
  const columns: IColumn[] = [
    {
      key: 'periodo',
      name: 'Período',
      fieldName: 'periodo',
      minWidth: 70,
      maxWidth: 130,
      isResizable: false,
      data: 'string',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
          {item.periodo}
        </Text>
      ),
    },
    {
      key: 'vencidas',
      name: 'Vencidas',
      fieldName: 'vencidas',
      minWidth: 70,
      maxWidth: 130,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium">
          {item.vencidas.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'pendientes',
      name: 'Pendientes',
      fieldName: 'pendientes',
      minWidth: 80,
      maxWidth: 150,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium">
          {item.pendientes.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'truncas',
      name: 'Truncas',
      fieldName: 'truncas',
      minWidth: 70,
      maxWidth: 130,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium">
          {item.truncas.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'diasLibres',
      name: 'Días Libres',
      fieldName: 'diasLibres',
      minWidth: 80,
      maxWidth: 150,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium" styles={{ root: { color: '#2e7d32', fontWeight: 600 } }}>
          {item.diasLibres.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'diasBloque',
      name: 'Días Bloque',
      fieldName: 'diasBloque',
      minWidth: 80,
      maxWidth: 150,
      isResizable: false,
      data: 'number',
      isPadded: true,
      onRender: (item: HistorialVacacionesDto) => (
        <Text variant="medium" styles={{ root: { color: '#1976d2', fontWeight: 600 } }}>
          {item.diasBloque.toFixed(2)}
        </Text>
      ),
    },
  ];

  const handleDismissMessage = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Stack styles={styles.root}>
      <Text styles={styles.pageTitle}>Solicitud de Vacaciones</Text>

      {/* Mensajes de error o éxito */}
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={handleDismissMessage}
        >
          {error}
        </MessageBar>
      )}

      {successMessage && (
        <MessageBar
          messageBarType={MessageBarType.success}
          onDismiss={handleDismissMessage}
        >
          {successMessage}
        </MessageBar>
      )}

      {/* Formulario de solicitud */}
      <Stack styles={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <Stack styles={styles.formGrid}>
            {/* Tipo de Vacaciones */}
            <Dropdown
              label="Tipo de Vacaciones"
              placeholder="Seleccione el tipo"
              options={tipoVacacionesOptions}
              selectedKey={vacationRequest.tipoVacaciones}
              onChange={(_, option) => 
                handleInputChange('tipoVacaciones', option?.key as string)
              }
              required={showValidation}
            />

            {/* Días Solicitados */}
            <Dropdown
              label="Días Solicitados"
              placeholder="Seleccione los días"
              options={diasSolicitadosOptions}
              selectedKey={vacationRequest.diasSolicitados > 0 ? vacationRequest.diasSolicitados.toString() : undefined}
              onChange={(_, option) => 
                handleInputChange('diasSolicitados', parseInt(option?.key as string))
              }
              disabled={daysOptions.length === 0}
              required={showValidation}
            />

            {/* Fecha de Inicio */}
            <Stack styles={styles.datePickerContainer}>
              <DatePicker
                label="Fecha de Inicio"
                placeholder="Seleccione la fecha de inicio"
                value={vacationRequest.fechaInicio || undefined}
                onSelectDate={(date) => handleInputChange('fechaInicio', date)}
                firstDayOfWeek={DayOfWeek.Monday}
                formatDate={(date) => date ? date.toLocaleDateString('es-ES') : ''}
                strings={datePickerStrings}
                allowTextInput={false}
                isRequired={showValidation}
                minDate={getMinDate()}
              />
            </Stack>

            {/* Fecha de Fin (solo lectura) */}
            <Stack styles={styles.datePickerContainer}>
              <DatePicker
                label="Fecha de Fin"
                placeholder="Se calcula automáticamente"
                value={vacationRequest.fechaFin || undefined}
                onSelectDate={() => {}} // No hacer nada, es solo lectura
                firstDayOfWeek={DayOfWeek.Monday}
                formatDate={(date) => date ? date.toLocaleDateString('es-ES') : ''}
                strings={datePickerStrings}
                disabled
                allowTextInput={false}
              />
            </Stack>

            {/* Observaciones */}
            <Stack styles={styles.fullWidthField}>
              <TextField
                label="Observaciones (opcional)"
                placeholder="Escriba aquí cualquier comentario adicional sobre su solicitud..."
                value={vacationRequest.observaciones}
                onChange={(_, newValue) => handleInputChange('observaciones', newValue || '')}
                multiline
                rows={3}
                maxLength={1000}
              />
            </Stack>
          </Stack>

          {/* Información del período seleccionado */}
          {selectedPeriod && (
            <Stack styles={styles.periodInfo}>
              <Text>
                Estás utilizando días del período: {selectedPeriod.periodo}
              </Text>
            </Stack>
          )}

          {/* Botón de envío */}
          <Stack styles={styles.fullWidthField}>
            <PrimaryButton
              type="submit"
              text={isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              disabled={isSubmitting || !selectedPeriod}
              styles={styles.submitButton}
              iconProps={isSubmitting ? { iconName: 'Loading' } : undefined}
            />
          </Stack>
        </form>
      </Stack>

      {/* Sección de historial */}
      <Stack styles={styles.historialSection}>
        <Text styles={styles.sectionTitle}>Saldo de Vacaciones</Text>

        <Stack styles={styles.tableContainer}>
          {isLoadingHistory ? (
            <Stack styles={styles.loadingContainer}>
              <Spinner size={SpinnerSize.large} label="Cargando historial..." />
            </Stack>
          ) : historialData.length === 0 ? (
            <Stack styles={styles.emptyState}>
              <Text>No hay datos de historial disponibles</Text>
            </Stack>
          ) : (
            <div className="vacation-table-container">
              <DetailsList
                items={historialData}
                columns={columns}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionMode={SelectionMode.none}
                isHeaderVisible={true}
                compact={true}
                setKey="historialVacaciones"
                onShouldVirtualize={() => false}
              />
            </div>
          )}
        </Stack>
      </Stack>

      {/* Notificación de éxito en esquina superior derecha */}
      {showSuccessNotification && (
        <Stack styles={styles.successNotification}>
          <Text styles={styles.notificationText}>
            ¡Solicitud de vacaciones enviada exitosamente!
          </Text>
          <IconButton
            iconProps={{ iconName: 'Clear' }}
            title="Cerrar"
            ariaLabel="Cerrar notificación"
            styles={styles.notificationCloseButton}
            onClick={() => setShowSuccessNotification(false)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default SolVacaciones;
