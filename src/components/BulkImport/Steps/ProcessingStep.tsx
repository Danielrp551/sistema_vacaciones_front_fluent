import { Stack, Text, Spinner, SpinnerSize, PrimaryButton, DefaultButton, Icon, MessageBar, MessageBarType, ProgressIndicator } from '@fluentui/react';
import type { BulkImportResult, EstadoBulkImport, BulkImportValidationResult } from '../../../types/bulkImport';

// ============================================================================
// TIPOS
// ============================================================================

export interface ProcessingStepProps {
  entityType: string;
  estado: EstadoBulkImport;
  processResult?: BulkImportResult | null;
  validationResult?: BulkImportValidationResult | null;
  error?: string | null;
  progreso?: number;
  onReset: () => void;
  onClose: () => void;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export const ProcessingStep = ({
  entityType,
  estado,
  processResult,
  validationResult,
  error,
  progreso = 0,
  onReset,
  onClose
}: ProcessingStepProps) => {
  const containerStyles = {
    root: {
      padding: '24px'
    }
  };

  const centerStyles = {
    root: {
      textAlign: 'center' as const,
      padding: '32px 16px'
    }
  };

  const headerStyles = {
    root: {
      fontSize: '18px',
      fontWeight: '600' as const,
      color: '#323130',
      marginBottom: '8px'
    }
  };

  const renderProcessingInProgress = () => (
    <Stack horizontalAlign="center" styles={centerStyles}>
      <Spinner size={SpinnerSize.large} styles={{ root: { marginBottom: '16px' } }} />
      <Text styles={headerStyles}>Procesando Datos</Text>
      <Text styles={{ root: { fontSize: '14px', color: '#605e5c', marginBottom: '16px' } }}>
        Creando registros de {entityType}...
      </Text>
      
      <Stack styles={{ root: { width: '100%', maxWidth: '300px' } }} tokens={{ childrenGap: 8 }}>
        <ProgressIndicator percentComplete={progreso / 100} />
        <Text styles={{ root: { fontSize: '12px', color: '#605e5c', textAlign: 'center' as const } }}>
          {progreso}% completado
        </Text>
      </Stack>
    </Stack>
  );

  const renderProcessingError = () => (
    <Stack horizontalAlign="center" styles={centerStyles}>
      <Stack
        styles={{
          root: {
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            marginBottom: '16px',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Icon iconName="ErrorBadge" styles={{ root: { fontSize: '32px', color: '#dc2626' } }} />
      </Stack>
      <Text styles={headerStyles}>Error en el Procesamiento</Text>
      <Text styles={{ root: { fontSize: '14px', color: '#605e5c', marginBottom: '24px' } }}>
        {error}
      </Text>
      
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <DefaultButton
          text="Reintentar"
          onClick={onReset}
          iconProps={{ iconName: 'Refresh' }}
        />
        <PrimaryButton
          text="Cerrar"
          onClick={onClose}
          iconProps={{ iconName: 'Cancel' }}
          styles={{ root: { backgroundColor: '#dc2626' } }}
        />
      </Stack>
    </Stack>
  );

  const renderProcessingComplete = () => {
    if (!processResult) return null;

    const hasErrors = processResult.registrosFallidos.length > 0;
    const successRate = processResult.estadisticas.totalRegistrosProcesados > 0 
      ? Math.round((processResult.estadisticas.usuariosCreados / processResult.estadisticas.totalRegistrosProcesados) * 100)
      : 0;

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        {/* Estado general */}
        <MessageBar
          messageBarType={processResult.esExitoso ? MessageBarType.success : MessageBarType.warning}
        >
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Stack
              styles={{
                root: {
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: processResult.esExitoso ? '#f0f9ff' : '#fffbeb',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }}
            >
              <Icon 
                iconName={processResult.esExitoso ? "Accept" : "Warning"} 
                styles={{ 
                  root: { 
                    fontSize: '32px', 
                    color: processResult.esExitoso ? '#059669' : '#d97706' 
                  } 
                }}
              />
            </Stack>
            
            <Stack horizontalAlign="center">
              <Text styles={{ root: { fontSize: '20px', fontWeight: '600' as const } }}>
                {processResult.esExitoso ? 'Procesamiento Completado' : 'Procesamiento Completado con Errores'}
              </Text>
              <Text styles={{ root: { fontSize: '14px' } }}>
                {processResult.esExitoso 
                  ? `Todos los registros de ${entityType} fueron procesados exitosamente`
                  : `El procesamiento finalizó con algunos errores`
                }
              </Text>
            </Stack>
          </Stack>
        </MessageBar>

        {/* Estadísticas detalladas */}
        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <Stack 
            styles={{ 
              root: { 
                border: '1px solid #edebe9', 
                borderRadius: '4px', 
                padding: '16px', 
                textAlign: 'center' as const,
                flex: 1
              } 
            }}
          >
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#0078d4' } }}>
              {processResult.estadisticas.totalRegistrosProcesados}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Total Procesados
            </Text>
          </Stack>
          
          <Stack 
            styles={{ 
              root: { 
                border: '1px solid #edebe9', 
                borderRadius: '4px', 
                padding: '16px', 
                textAlign: 'center' as const,
                flex: 1
              } 
            }}
          >
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#107c10' } }}>
              {processResult.estadisticas.usuariosCreados}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Exitosos
            </Text>
          </Stack>
          
          <Stack 
            styles={{ 
              root: { 
                border: '1px solid #edebe9', 
                borderRadius: '4px', 
                padding: '16px', 
                textAlign: 'center' as const,
                flex: 1
              } 
            }}
          >
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#dc2626' } }}>
              {processResult.registrosFallidos.length}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Con Errores
            </Text>
          </Stack>
          
          <Stack 
            styles={{ 
              root: { 
                border: '1px solid #edebe9', 
                borderRadius: '4px', 
                padding: '16px', 
                textAlign: 'center' as const,
                flex: 1
              } 
            }}
          >
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#8764b8' } }}>
              {successRate}%
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Tasa de Éxito
            </Text>
          </Stack>
        </Stack>

        {/* Barra de progreso final */}
        <Stack 
          styles={{ 
            root: { 
              border: '1px solid #edebe9', 
              borderRadius: '4px', 
              padding: '16px'
            } 
          }}
        >
          <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: '8px' } }}>
            <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
              Progreso del procesamiento
            </Text>
            <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
              100%
            </Text>
          </Stack>
          <ProgressIndicator percentComplete={1} />
        </Stack>

        {/* Detalles de tiempo */}
        {processResult.estadisticas.tiempoProcesamiento && (
          <MessageBar messageBarType={MessageBarType.info}>
            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                Detalles del Proceso
              </Text>
              <Stack horizontal tokens={{ childrenGap: 32 }}>
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>Tiempo transcurrido:</Text>
                  <Text styles={{ root: { fontSize: '13px' } }}>{processResult.estadisticas.tiempoProcesamiento}s</Text>
                </Stack>
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>Velocidad promedio:</Text>
                  <Text styles={{ root: { fontSize: '13px' } }}>
                    {processResult.estadisticas.totalRegistrosProcesados > 0 && processResult.estadisticas.tiempoProcesamiento 
                      ? `${Math.round(processResult.estadisticas.totalRegistrosProcesados / processResult.estadisticas.tiempoProcesamiento)} registros/segundo`
                      : 'N/A'
                    }
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </MessageBar>
        )}

        {/* Errores detallados */}
        {hasErrors && (
          <Stack>
            <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px', marginBottom: '8px' } }}>
              Errores de Procesamiento ({processResult.registrosFallidos.length})
            </Text>
            <Stack 
              styles={{ 
                root: { 
                  maxHeight: '192px', 
                  overflowY: 'auto',
                  border: '1px solid #f3f2f1',
                  borderRadius: '4px',
                  padding: '8px'
                } 
              }}
              tokens={{ childrenGap: 8 }}
            >
              {processResult.registrosFallidos.slice(0, 10).map((error: any, index: number) => (
                <Stack 
                  key={index}
                  styles={{ 
                    root: { 
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      padding: '8px'
                    } 
                  }}
                >
                  <Text styles={{ root: { fontSize: '13px', fontWeight: '600' as const, color: '#dc2626' } }}>
                    {error.numeroFila ? `Fila ${error.numeroFila}:` : 'Error general:'}
                  </Text>
                  <Text styles={{ root: { fontSize: '13px', color: '#dc2626' } }}>
                    {error.mensaje}
                  </Text>
                  {error.sugerencia && (
                    <Text styles={{ root: { fontSize: '12px', color: '#dc2626' } }}>
                      💡 {error.sugerencia}
                    </Text>
                  )}
                </Stack>
              ))}
              {processResult.registrosFallidos.length > 10 && (
                <Text 
                  styles={{ 
                    root: { 
                      fontSize: '13px', 
                      color: '#dc2626', 
                      textAlign: 'center' as const,
                      padding: '8px'
                    } 
                  }}
                >
                  ... y {processResult.registrosFallidos.length - 10} errores más
                </Text>
              )}
            </Stack>
          </Stack>
        )}

        {/* Registros creados exitosamente */}
        {processResult.usuariosCreados && processResult.usuariosCreados.length > 0 && (
          <MessageBar messageBarType={MessageBarType.success}>
            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                Registros Creados Exitosamente ({processResult.usuariosCreados.length})
              </Text>
              <Stack 
                styles={{ 
                  root: { 
                    maxHeight: '128px', 
                    overflowY: 'auto'
                  } 
                }}
              >
                <Stack tokens={{ childrenGap: 4 }}>
                  {processResult.usuariosCreados.slice(0, 5).map((registro: any, index: number) => (
                    <Stack 
                      key={index}
                      styles={{ 
                        root: { 
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '4px 8px'
                        } 
                      }}
                    >
                      <Text styles={{ root: { fontSize: '12px', color: '#1e40af' } }}>
                        {registro.email || registro.nombre || `Registro ${index + 1}`}
                      </Text>
                    </Stack>
                  ))}
                  {processResult.usuariosCreados.length > 5 && (
                    <Text styles={{ root: { fontSize: '12px', textAlign: 'center' as const, padding: '4px' } }}>
                      ... y {processResult.usuariosCreados.length - 5} más
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </MessageBar>
        )}

        {/* Información del archivo original */}
        {validationResult && (
          <MessageBar messageBarType={MessageBarType.info}>
            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                Resumen de Validación
              </Text>
              <Stack tokens={{ childrenGap: 4 }}>
                <Text styles={{ root: { fontSize: '13px' } }}>
                  Registros encontrados en archivo: <Text styles={{ root: { fontWeight: '600' as const } }}>{validationResult.usuariosEncontrados}</Text>
                </Text>
                <Text styles={{ root: { fontSize: '13px' } }}>
                  Registros procesados exitosamente: <Text styles={{ root: { fontWeight: '600' as const } }}>{processResult.estadisticas.usuariosCreados}</Text>
                </Text>
                {validationResult.erroresValidacion.length > 0 && (
                  <Text styles={{ root: { fontSize: '13px' } }}>
                    Errores de validación previos: <Text styles={{ root: { fontWeight: '600' as const } }}>{validationResult.erroresValidacion.length}</Text>
                  </Text>
                )}
              </Stack>
            </Stack>
          </MessageBar>
        )}

        {/* Acciones finales */}
        <Stack 
          horizontal 
          horizontalAlign="center" 
          tokens={{ childrenGap: 12 }}
          styles={{ root: { paddingTop: '16px', borderTop: '1px solid #edebe9' } }}
        >
          <DefaultButton
            text="Procesar Otro Archivo"
            onClick={onReset}
            iconProps={{ iconName: 'Add' }}
          />
          <PrimaryButton
            text="Finalizar"
            onClick={onClose}
            iconProps={{ iconName: 'CheckMark' }}
          />
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack styles={containerStyles}>
      <Stack styles={{ root: { marginBottom: '24px' } }}>
        <Text styles={headerStyles}>
          Procesamiento de Datos
        </Text>
        <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
          {estado === 'procesando' 
            ? `Creando registros de ${entityType} en el sistema...`
            : `Resultado del procesamiento de ${entityType}.`
          }
        </Text>
      </Stack>

      {estado === 'procesando' && renderProcessingInProgress()}
      {estado === 'error' && renderProcessingError()}
      {estado === 'completado' && renderProcessingComplete()}
    </Stack>
  );
};
