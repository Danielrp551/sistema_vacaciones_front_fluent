import { useState, useCallback, useEffect } from 'react';
import { Stack, Text, Icon, Panel, PanelType, PrimaryButton, DefaultButton, TooltipHost } from '@fluentui/react';
import { useBulkImport, usePlantillasBulkImport } from '../../hooks/useBulkImport';
import { FileSelectionStep, ConfigurationStep, ValidationStep, ProcessingStep } from './Steps';

// ============================================================================
// TIPOS
// ============================================================================

export interface BulkImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: 'usuarios' | 'departamentos' | 'roles';
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const BulkImportDrawer = ({ 
  isOpen, 
  onClose, 
  entityType = 'usuarios',
  onSuccess,
  onError
}: BulkImportDrawerProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    estado,
    archivo,
    configuracion,
    validacionResult,
    processingResult,
    error,
    seleccionarArchivo,
    validarArchivo,
    procesarArchivo,
    resetear,
    actualizarConfiguracion
  } = useBulkImport();

  const { 
    descargarPlantillaExcel, 
    descargarPlantillaCsv, 
    descargando 
  } = usePlantillasBulkImport();

  // Manejo de errores del hook con useEffect para evitar loops
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Configuración inicial - simplificada ya que usamos el hook
  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'usuarios': return 'Usuarios';
      case 'departamentos': return 'Departamentos';
      case 'roles': return 'Roles';
      default: return 'Entidades';
    }
  };

  // Handlers
  const handleFileSelect = useCallback((files: File[]) => {
    seleccionarArchivo(files[0]);
    setCurrentStep(2);
  }, [seleccionarArchivo]);

  const handleNext = useCallback(() => {
    if (currentStep === 1 && archivo) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      validarArchivo();
    } else if (currentStep === 3 && (estado === 'validado' || estado === 'validacion-fallida')) {
      setCurrentStep(4);
      if (estado === 'validado') {
        procesarArchivo();
      }
    }
  }, [currentStep, archivo, estado, validarArchivo, procesarArchivo]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleClose = useCallback(() => {
    resetear();
    setCurrentStep(1);
    onClose();
  }, [resetear, onClose]);

  const handleComplete = useCallback(() => {
    if (processingResult) {
      if (processingResult.esExitoso) {
        onSuccess?.(`Se procesaron exitosamente ${processingResult.estadisticas.usuariosCreados} ${entityType}`);
      } else {
        onError?.(`Procesamiento completado con errores. ${processingResult.registrosFallidos.length} registros fallidos`);
      }
    }
    handleClose();
  }, [processingResult, handleClose, onSuccess, onError, entityType]);

  const canGoNext = () => {
    switch (currentStep) {
      case 1: return !!archivo;
      case 2: return true;
      case 3: return estado === 'validado' || estado === 'validacion-fallida';
      case 4: return false;
      default: return false;
    }
  };

  const canGoBack = () => {
    return currentStep > 1 && !['procesando', 'validando'].includes(estado);
  };

  const getNextLabel = () => {
    switch (currentStep) {
      case 1: return 'Continuar';
      case 2: return 'Validar Archivo';
      case 3: return estado === 'validacion-fallida' ? 'Procesar con Errores' : 'Procesar Archivo';
      case 4: return 'Completar';
      default: return 'Siguiente';
    }
  };

  // Componente de indicador de pasos usando Fluent UI
  const SimpleStepIndicator = () => {
    const steps = [
      { id: 1, title: 'Selección de Archivo', icon: 'CloudUpload', completed: currentStep > 1, active: currentStep === 1 },
      { id: 2, title: 'Configuración', icon: 'Settings', completed: currentStep > 2, active: currentStep === 2 },
      { id: 3, title: 'Validación', icon: 'CheckMark', completed: currentStep > 3, active: currentStep === 3 },
      { id: 4, title: 'Procesamiento', icon: 'Processing', completed: estado === 'completado', active: currentStep === 4 }
    ];

    const stepIndicatorStyles = {
      container: {
        padding: '16px 24px',
        borderBottom: '1px solid #edebe9',
        backgroundColor: '#faf9f8'
      },
      step: {
        alignItems: 'center',
        gap: '12px'
      },
      stepNumber: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '16px',
        cursor: 'default',
        transition: 'all 0.2s ease',
      },
      stepNumberCompleted: {
        backgroundColor: '#107c10',
        color: '#ffffff'
      },
      stepNumberActive: {
        backgroundColor: '#0078d4',
        color: '#ffffff'
      },
      stepNumberInactive: {
        backgroundColor: '#d2d0ce',
        color: '#605e5c'
      },
      connector: {
        width: '24px',
        height: '2px',
        backgroundColor: '#d2d0ce',
        margin: '0 12px 0 0',
      },
      connectorCompleted: {
        backgroundColor: '#107c10'
      }
    };

    return (
      <Stack horizontal horizontalAlign="center" styles={{ root: stepIndicatorStyles.container }}>
        {steps.map((step, index) => (
          <Stack key={step.id} horizontal verticalAlign="center" styles={{ root: stepIndicatorStyles.step }}>
            <TooltipHost content={step.title}>
              <Stack
                styles={{
                  root: {
                    ...stepIndicatorStyles.stepNumber,
                    ...(step.completed ? stepIndicatorStyles.stepNumberCompleted :
                        step.active ? stepIndicatorStyles.stepNumberActive :
                        stepIndicatorStyles.stepNumberInactive)
                  }
                }}
              >
                {step.completed ? (
                  <Icon iconName="Accept" styles={{ root: { fontSize: '20px' } }} />
                ) : (
                  <Icon iconName={step.icon} styles={{ root: { fontSize: '20px' } }} />
                )}
              </Stack>
            </TooltipHost>
            {index < steps.length - 1 && (
              <Stack
                styles={{
                  root: {
                    ...stepIndicatorStyles.connector,
                    ...(step.completed ? stepIndicatorStyles.connectorCompleted : {})
                  }
                }}
              />
            )}
          </Stack>
        ))}
      </Stack>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FileSelectionStep
            entityType={entityType}
            selectedFile={archivo}
            onFileSelect={handleFileSelect}
            onDownloadExcel={descargarPlantillaExcel}
            onDownloadCsv={descargarPlantillaCsv}
            downloadingTemplate={descargando}
            error={error}
          />
        );
      
      case 2:
        return (
          <ConfigurationStep
            entityType={entityType}
            config={configuracion}
            onChange={actualizarConfiguracion}
          />
        );
      
      case 3:
        return (
          <ValidationStep
            entityType={entityType}
            archivo={archivo}
            validationResult={validacionResult}
            estado={estado}
            error={error}
            onRetry={validarArchivo}
          />
        );
      
      case 4:
        return (
          <ProcessingStep
            entityType={entityType}
            estado={estado}
            processResult={processingResult}
            validationResult={validacionResult}
            error={error}
            onReset={() => {
              resetear();
              setCurrentStep(1);
            }}
            onClose={handleComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={handleClose}
      type={PanelType.medium}
      headerText={`Importación Masiva de ${getEntityLabel(entityType)}`}
      styles={{
        main: { zIndex: 1000 },
        content: { padding: 0 },
        scrollableContent: { padding: 0 }
      }}
    >
      <Stack styles={{ root: { height: '100%' } }}>
        {/* Subtitle */}
        <Stack styles={{ root: { padding: '16px 20px 0 20px' } }}>
          <Text styles={{ root: { fontSize: '14px', color: '#605e5c' } }}>
            Sigue los pasos para importar datos desde Excel o CSV
          </Text>
        </Stack>
        
        {/* Step Indicator */}
        <Stack styles={{ root: { padding: '20px', borderBottom: '1px solid #edebe9' } }}>
          <SimpleStepIndicator />
        </Stack>
        
        {/* Content */}
        <Stack styles={{ root: { flex: 1, overflow: 'hidden' } }}>
          {renderCurrentStep()}
        </Stack>

        {/* Navigation */}
        <Stack 
          horizontal 
          horizontalAlign="space-between" 
          styles={{ 
            root: { 
              padding: '16px 20px', 
              borderTop: '1px solid #edebe9',
              backgroundColor: '#faf9f8'
            } 
          }}
        >
          <DefaultButton
            text="Cancelar"
            onClick={handleClose}
            disabled={['procesando', 'validando'].includes(estado)}
          />
          
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            {canGoBack() && (
              <DefaultButton
                text="Anterior"
                onClick={handleBack}
                disabled={['procesando', 'validando'].includes(estado)}
                iconProps={{ iconName: 'ChevronLeft' }}
              />
            )}
            
            {canGoNext() && (
              <PrimaryButton
                text={getNextLabel()}
                onClick={handleNext}
                disabled={!canGoNext() || ['procesando', 'validando'].includes(estado)}
                iconProps={{ iconName: 'ChevronRight' }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Panel>
  );
};
