import { Stack, Text, Icon, MessageBar, MessageBarType } from '@fluentui/react';
import { FileDropZone, TemplateDownload, FilePreview, type TemplateConfig } from '../../Common/FileUpload/FileUploadComponents';
import bulkImportService from '../../../services/bulkImport.service';
import type { ArchivoInfo } from '../../../types/bulkImport';

// ============================================================================
// TIPOS
// ============================================================================

export interface FileSelectionStepProps {
  entityType: string;
  selectedFile?: ArchivoInfo | null;
  onFileSelect: (files: File[]) => void;
  onDownloadExcel: () => Promise<void>;
  onDownloadCsv: () => Promise<void>;
  downloadingTemplate?: string | null;
  error?: string | null;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export const FileSelectionStep = ({
  entityType,
  selectedFile,
  onFileSelect,
  onDownloadExcel,
  onDownloadCsv,
  downloadingTemplate,
  error
}: FileSelectionStepProps) => {
  const templates: TemplateConfig[] = [
    {
      type: 'excel',
      label: 'Plantilla Excel',
      description: 'Descargar archivo .xlsx con estructura',
      icon: (
        <Icon iconName="ExcelDocument" styles={{ root: { fontSize: '24px', color: '#107c10' } }} />
      )
    },
    {
      type: 'csv',
      label: 'Plantilla CSV',
      description: 'Descargar archivo .csv con estructura',
      icon: (
        <Icon iconName="TextDocument" styles={{ root: { fontSize: '24px', color: '#0078d4' } }} />
      )
    }
  ];

  const handleTemplateDownload = async (templateType: string) => {
    try {
      if (templateType === 'excel') {
        await onDownloadExcel();
      } else if (templateType === 'csv') {
        await onDownloadCsv();
      }
    } catch (err) {
      console.error('Error downloading template:', err);
    }
  };

  const validator = (file: File) => {
    const result = bulkImportService.validarArchivo(file);
    return {
      isValid: result.esValido,
      errors: result.errores
    };
  };

  const containerStyles = {
    root: {
      padding: '24px'
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

  const descriptionStyles = {
    root: {
      fontSize: '14px',
      color: '#605e5c',
      marginBottom: '20px'
    }
  };

  return (
    <Stack styles={containerStyles}>
      {/* Header */}
      <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: '24px' } }}>
        <Text styles={headerStyles}>
          Seleccionar Archivo de {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
        </Text>
        <Text styles={descriptionStyles}>
          Sube un archivo Excel (.xlsx) o CSV (.csv) con los datos a importar.
        </Text>
      </Stack>

      {/* Error Message */}
      {error && (
        <MessageBar 
          messageBarType={MessageBarType.error}
          styles={{ root: { marginBottom: '16px' } }}
        >
          {error}
        </MessageBar>
      )}

      {/* File Selection */}
      <Stack styles={{ root: { marginBottom: '24px' } }}>
        {selectedFile ? (
          <FilePreview
            file={selectedFile.archivo}
            onRemove={() => onFileSelect([])}
            metadata={{
              validationStatus: selectedFile.esValido ? 'valid' : 'invalid',
              errors: selectedFile.errores
            }}
          />
        ) : (
          <FileDropZone
            acceptedTypes={['.xlsx', '.xls', '.csv']}
            maxSize={10 * 1024 * 1024} // 10 MB
            onFileSelect={onFileSelect}
            validator={validator}
            description={`Arrastra tu archivo de ${entityType} aquí o haz clic para seleccionar`}
          />
        )}
      </Stack>

      {/* Template Downloads */}
      <Stack styles={{ root: { marginBottom: '24px' } }}>
        <TemplateDownload
          templates={templates}
          onDownload={handleTemplateDownload}
          loading={downloadingTemplate}
        />
      </Stack>
      
      {/* Requirements */}
      <MessageBar messageBarType={MessageBarType.info}>
        <Stack tokens={{ childrenGap: 8 }}>
          <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
            Requisitos del archivo:
          </Text>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontSize: '13px' } }}>
              • Formato: Excel (.xlsx) o CSV (.csv)
            </Text>
            <Text styles={{ root: { fontSize: '13px' } }}>
              • Tamaño máximo: 10 MB
            </Text>
            <Text styles={{ root: { fontSize: '13px' } }}>
              • Primera fila debe contener los encabezados
            </Text>
            <Text styles={{ root: { fontSize: '13px' } }}>
              • Máximo 10,000 registros
            </Text>
            <Text styles={{ root: { fontSize: '13px' } }}>
              • Usar las plantillas proporcionadas para evitar errores
            </Text>
          </Stack>
        </Stack>
      </MessageBar>
    </Stack>
  );
};
