import { useCallback, useRef, useState } from 'react';
import { Stack, Text, Icon, Spinner, SpinnerSize, DefaultButton } from '@fluentui/react';
import type { ReactNode, ChangeEvent, DragEvent } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

export interface FileDropZoneProps {
  acceptedTypes: string[];
  maxSize: number;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  onError?: (errors: string[]) => void;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  validator?: (file: File) => { isValid: boolean; errors: string[] };
  className?: string;
}

export interface TemplateConfig {
  type: string;
  label: string;
  icon: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface TemplateDownloadProps {
  templates: TemplateConfig[];
  onDownload: (templateType: string) => Promise<void>;
  loading?: string | null;
  className?: string;
}

export interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  metadata?: {
    validationStatus?: 'valid' | 'invalid' | 'pending';
    errors?: string[];
    preview?: any;
  };
  className?: string;
}

// ============================================================================
// UTILIDADES
// ============================================================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (fileName: string): ReactNode => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'xlsx' || extension === 'xls') {
    return <Icon iconName="ExcelDocument" styles={{ root: { fontSize: '32px', color: '#107c10' } }} />;
  }
  
  if (extension === 'csv') {
    return <Icon iconName="DataManagementSettings" styles={{ root: { fontSize: '32px', color: '#0078d4' } }} />;
  }
  
  return <Icon iconName="Document" styles={{ root: { fontSize: '32px', color: '#605e5c' } }} />;
};

// ============================================================================
// FILE DROP ZONE GENÉRICA
// ============================================================================

export const FileDropZone = ({
  acceptedTypes,
  maxSize,
  multiple = false,
  onFileSelect,
  onError,
  disabled = false,
  description = "Arrastra archivos aquí o haz clic para seleccionar",
  icon,
  validator,
  className = ''
}: FileDropZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const errors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      // Validar tipo
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(extension)) {
        errors.push(`El archivo ${file.name} no es un tipo válido. Tipos permitidos: ${acceptedTypes.join(', ')}`);
        return;
      }

      // Validar tamaño
      if (file.size > maxSize) {
        errors.push(`El archivo ${file.name} excede el tamaño máximo de ${formatFileSize(maxSize)}`);
        return;
      }

      // Validación personalizada
      if (validator) {
        const validation = validator(file);
        if (!validation.isValid) {
          errors.push(...validation.errors);
          return;
        }
      }

      validFiles.push(file);
    });

    if (errors.length > 0 && onError) {
      onError(errors);
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [acceptedTypes, maxSize, validator, onFileSelect, onError]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (!disabled && e.dataTransfer.files) {
      validateFiles(e.dataTransfer.files);
    }
  }, [disabled, validateFiles]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateFiles(e.target.files);
    }
  }, [validateFiles]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const defaultIcon = <Icon iconName="CloudUpload" styles={{ root: { fontSize: '48px', color: '#605e5c' } }} />;

  const dropZoneStyles = {
    root: {
      border: `2px dashed ${isDragActive ? '#0078d4' : disabled ? '#c8c6c4' : '#8a8886'}`,
      borderRadius: '4px',
      padding: '24px',
      textAlign: 'center' as const,
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDragActive ? '#f3f9fd' : disabled ? '#f3f2f1' : '#ffffff',
      transition: 'all 0.2s ease-in-out',
      ':hover': !disabled ? {
        borderColor: '#605e5c'
      } : {}
    }
  };

  const textStyles = {
    root: {
      fontSize: '14px',
      color: disabled ? '#a19f9d' : '#323130',
      marginTop: '8px'
    }
  };

  const subtextStyles = {
    root: {
      fontSize: '12px',
      color: '#605e5c',
      marginTop: '4px'
    }
  };

  return (
    <Stack
      styles={dropZoneStyles}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={className}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }}>
        {icon || defaultIcon}
        
        <Text styles={textStyles}>
          {isDragActive ? 'Suelta los archivos aquí' : description}
        </Text>
        
        <Text styles={subtextStyles}>
          Formatos: {acceptedTypes.join(', ')} • Máximo: {formatFileSize(maxSize)}
        </Text>
      </Stack>
    </Stack>
  );
};

// ============================================================================
// PREVIEW DE ARCHIVO
// ============================================================================

export const FilePreview = ({ 
  file, 
  onRemove, 
  metadata,
  className = '' 
}: FilePreviewProps) => {
  const getStatusColors = () => {
    switch (metadata?.validationStatus) {
      case 'valid': 
        return {
          backgroundColor: '#f0f9ff',
          borderColor: '#93c5fd',
          textColor: '#059669'
        };
      case 'invalid': 
        return {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          textColor: '#dc2626'
        };
      case 'pending': 
        return {
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          textColor: '#d97706'
        };
      default: 
        return {
          backgroundColor: '#f9fafb',
          borderColor: '#e5e7eb',
          textColor: '#374151'
        };
    }
  };

  const getStatusIcon = () => {
    switch (metadata?.validationStatus) {
      case 'valid':
        return <Icon iconName="Accept" styles={{ root: { fontSize: '20px', color: '#059669' } }} />;
      case 'invalid':
        return <Icon iconName="Cancel" styles={{ root: { fontSize: '20px', color: '#dc2626' } }} />;
      case 'pending':
        return <Spinner size={SpinnerSize.small} />;
      default:
        return null;
    }
  };

  const colors = getStatusColors();
  
  const containerStyles = {
    root: {
      border: `1px solid ${colors.borderColor}`,
      borderRadius: '4px',
      padding: '16px',
      backgroundColor: colors.backgroundColor
    }
  };

  return (
    <Stack styles={containerStyles} className={className}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
          {getFileIcon(file.name)}
          <Stack>
            <Text styles={{ root: { fontSize: '14px', fontWeight: '600' as const, color: '#323130' } }}>
              {file.name}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              {formatFileSize(file.size)}
            </Text>
          </Stack>
        </Stack>
        
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
          {getStatusIcon()}
          
          {onRemove && (
            <DefaultButton
              iconProps={{ iconName: 'Cancel' }}
              onClick={onRemove}
              styles={{ 
                root: { 
                  minWidth: '32px', 
                  width: '32px', 
                  height: '32px', 
                  padding: 0 
                } 
              }}
              title="Eliminar archivo"
            />
          )}
        </Stack>
      </Stack>
      
      {metadata?.errors && metadata.errors.length > 0 && (
        <Stack styles={{ root: { marginTop: '12px' } }}>
          <Stack tokens={{ childrenGap: 4 }}>
            {metadata.errors.map((error, index) => (
              <Text key={index} styles={{ root: { fontSize: '12px', color: '#dc2626' } }}>
                • {error}
              </Text>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

// ============================================================================
// DESCARGA DE PLANTILLAS GENÉRICA
// ============================================================================

export const TemplateDownload = ({
  templates,
  onDownload,
  loading,
  className = ''
}: TemplateDownloadProps) => {
  return (
    <Stack tokens={{ childrenGap: 16 }} className={className}>
      <Text styles={{ root: { fontSize: '14px', fontWeight: '600' as const, color: '#323130' } }}>
        Plantillas Disponibles
      </Text>
      
      <Stack tokens={{ childrenGap: 12 }}>
        {templates.map(template => (
          <DefaultButton
            key={template.type}
            onClick={() => onDownload(template.type)}
            disabled={template.disabled || loading === template.type}
            styles={{
              root: {
                height: 'auto',
                padding: '12px',
                textAlign: 'left' as const,
                justifyContent: 'flex-start',
                border: '1px solid #8a8886',
                backgroundColor: '#ffffff'
              }
            }}
          >
            <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
              <Stack styles={{ root: { flexShrink: 0 } }}>
                {loading === template.type ? (
                  <Spinner size={SpinnerSize.small} />
                ) : (
                  template.icon
                )}
              </Stack>
              
              <Stack>
                <Text styles={{ root: { fontSize: '14px', fontWeight: '600' as const, color: '#323130' } }}>
                  {template.label}
                </Text>
                {template.description && (
                  <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
                    {template.description}
                  </Text>
                )}
              </Stack>
            </Stack>
          </DefaultButton>
        ))}
      </Stack>
    </Stack>
  );
};
