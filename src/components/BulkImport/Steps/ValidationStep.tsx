import { Stack, Text, Spinner, SpinnerSize, PrimaryButton, MessageBar, MessageBarType, Icon } from '@fluentui/react';
import type { BulkImportValidationResult, ArchivoInfo, EstadoBulkImport } from '../../../types/bulkImport';

// ============================================================================
// TIPOS
// ============================================================================

export interface ValidationStepProps {
  entityType: string;
  archivo?: ArchivoInfo | null;
  validationResult?: BulkImportValidationResult | null;
  estado: EstadoBulkImport;
  error?: string | null;
  onRetry: () => void;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export const ValidationStep = ({
  entityType,
  archivo,
  validationResult,
  estado,
  error,
  onRetry
}: ValidationStepProps) => {
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

  const renderValidationProgress = () => (
    <Stack horizontalAlign="center" styles={centerStyles}>
      <Spinner size={SpinnerSize.large} styles={{ root: { marginBottom: '16px' } }} />
      <Text styles={headerStyles}>Validando Archivo</Text>
      <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
        Verificando estructura y datos del archivo...
      </Text>
    </Stack>
  );

  const renderValidationError = () => (
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
      <Text styles={headerStyles}>Error de Validación</Text>
      <Text styles={{ root: { fontSize: '14px', color: '#605e5c', marginBottom: '16px' } }}>
        {error}
      </Text>
      <PrimaryButton
        text="Reintentar Validación"
        onClick={onRetry}
        iconProps={{ iconName: 'Refresh' }}
      />
    </Stack>
  );

  const renderValidationResults = () => {
    if (!validationResult) return null;

    const hasErrors = validationResult.erroresValidacion.length > 0;
    const hasWarnings = validationResult.advertencias.length > 0;

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        {/* Resumen */}
        <MessageBar
          messageBarType={validationResult.esValido ? MessageBarType.success : MessageBarType.error}
        >
          <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
            <Icon 
              iconName={validationResult.esValido ? "Accept" : "Cancel"} 
              styles={{ root: { fontSize: '16px' } }}
            />
            <Stack>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                {validationResult.esValido ? 'Archivo válido' : 'Archivo con errores'}
              </Text>
              <Text styles={{ root: { fontSize: '12px' } }}>
                {validationResult.usuariosEncontrados} registros encontrados
              </Text>
            </Stack>
          </Stack>
        </MessageBar>

        {/* Estadísticas */}
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
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#323130' } }}>
              {validationResult.usuariosEncontrados}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Total Registros
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
              {validationResult.erroresValidacion.length}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Errores
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
            <Text styles={{ root: { fontSize: '24px', fontWeight: '700' as const, color: '#d97706' } }}>
              {validationResult.advertencias.length}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Advertencias
            </Text>
          </Stack>
        </Stack>

        {/* Errores de archivo */}
        {validationResult.erroresArchivo.length > 0 && (
          <MessageBar messageBarType={MessageBarType.error}>
            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                Errores de Archivo
              </Text>
              <Stack tokens={{ childrenGap: 4 }}>
                {validationResult.erroresArchivo.map((error, index) => (
                  <Text key={index} styles={{ root: { fontSize: '13px' } }}>
                    • {error}
                  </Text>
                ))}
              </Stack>
            </Stack>
          </MessageBar>
        )}

        {/* Errores de validación */}
        {hasErrors && (
          <Stack>
            <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px', marginBottom: '8px' } }}>
              Errores de Validación ({validationResult.erroresValidacion.length})
            </Text>
            <Stack 
              styles={{ 
                root: { 
                  maxHeight: '240px', 
                  overflowY: 'auto',
                  border: '1px solid #f3f2f1',
                  borderRadius: '4px',
                  padding: '8px'
                } 
              }}
              tokens={{ childrenGap: 8 }}
            >
              {validationResult.erroresValidacion.slice(0, 10).map((error: any, index: number) => (
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
                    Fila {error.numeroFila}:
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
              {validationResult.erroresValidacion.length > 10 && (
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
                  ... y {validationResult.erroresValidacion.length - 10} errores más
                </Text>
              )}
            </Stack>
          </Stack>
        )}

        {/* Advertencias */}
        {hasWarnings && (
          <MessageBar messageBarType={MessageBarType.warning}>
            <Stack tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
                Advertencias ({validationResult.advertencias.length})
              </Text>
              <Stack tokens={{ childrenGap: 4 }}>
                {validationResult.advertencias.map((warning, index) => (
                  <Text key={index} styles={{ root: { fontSize: '13px' } }}>
                    • {warning}
                  </Text>
                ))}
              </Stack>
            </Stack>
          </MessageBar>
        )}

        {/* Información del archivo */}
        <MessageBar messageBarType={MessageBarType.info}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
              Información del Archivo
            </Text>
            <Stack horizontal tokens={{ childrenGap: 32 }}>
              <Stack tokens={{ childrenGap: 4 }}>
                <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>Nombre:</Text>
                <Text styles={{ root: { fontSize: '13px' } }}>{archivo?.nombre}</Text>
              </Stack>
              <Stack tokens={{ childrenGap: 4 }}>
                <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>Tamaño:</Text>
                <Text styles={{ root: { fontSize: '13px' } }}>
                  {archivo?.tamano ? Math.round(archivo.tamano / 1024) : 0} KB
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </MessageBar>
      </Stack>
    );
  };

  return (
    <Stack styles={containerStyles}>
      <Stack styles={{ root: { marginBottom: '24px' } }}>
        <Text styles={headerStyles}>
          Validación del Archivo
        </Text>
        <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
          Verificando la estructura y contenido del archivo de {entityType}.
        </Text>
      </Stack>

      {estado === 'validando' && renderValidationProgress()}
      {estado === 'error' && renderValidationError()}
      {(estado === 'validado' || estado === 'validacion-fallida') && renderValidationResults()}
    </Stack>
  );
};
