import React, { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Label,
  Separator,
  Icon,
  Toggle,
} from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { Drawer } from '../../Common/Drawer';
import { usePermisoForm, usePermisoById, useModulosDisponibles } from '../../../hooks/usePermisosAdmin';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type PermisoModalMode = 'create' | 'edit' | 'view';

export interface PermisoModalProps {
  isOpen: boolean;
  mode: PermisoModalMode;
  permisoId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const PermisoModal: React.FC<PermisoModalProps> = ({
  isOpen,
  mode,
  permisoId,
  onClose,
  onSuccess
}) => {
  // Estados locales
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Hook para obtener módulos disponibles
  const { modulos, loading: modulosLoading } = useModulosDisponibles();
  
  // Hook para obtener datos del permiso (en modo editar/ver)
  const { 
    permiso: permisoData, 
    loading: permisoLoading, 
    error: permisoError 
  } = usePermisoById(mode !== 'create' ? permisoId || null : null);
  
  const {
    formData,
    validationErrors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm
  } = usePermisoForm(
    (mode === 'edit' || mode === 'view') ? (permisoData || undefined) : undefined,
    () => {
      showNotification('Permiso guardado exitosamente', 'success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    },
    (error: string) => {
      showNotification(error, 'error');
    }
  );

  // ============================================================================
  // FUNCIONES DE RESET Y MANEJO DE FORMULARIO
  // ============================================================================

  // Función de reset personalizada para el modal
  const resetModalForm = useCallback(() => {
    if (mode === 'create') {
      // En modo crear, siempre limpiar todos los campos
      resetForm();
      // Asegurar que el formulario esté completamente limpio para crear
      setTimeout(() => {
        updateField('nombre', '');
        updateField('descripcion', '');
        updateField('modulo', '');
        updateField('codigoPermiso', '');
      }, 0);
    } else {
      // En modo editar/ver, resetear a los datos originales
      resetForm();
    }
  }, [mode, resetForm, updateField]);

  // ============================================================================
  // EFECTOS - Limpiar formulario al abrir modal
  // ============================================================================

  useEffect(() => {
    // Limpiar formulario cuando se abre el modal o cambia el modo
    if (isOpen) {
      resetModalForm();
    }
  }, [isOpen, mode, resetModalForm]);

  // Funciones auxiliares
  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSave = async () => {
    await submitForm();
  };

  const handleCancel = () => {
    resetModalForm();
    onClose();
  };

  // Configuración de opciones para dropdown de módulos
  const modulosOptions: IDropdownOption[] = modulos.map(modulo => ({
    key: modulo,
    text: modulo
  }));

  // Configuración del título del modal
  const getModalTitle = (): string => {
    switch (mode) {
      case 'create':
        return 'Crear Nuevo Permiso';
      case 'edit':
        return 'Editar Permiso';
      case 'view':
        return 'Detalles del Permiso';
      default:
        return 'Gestión de Permiso';
    }
  };

  // Configuración de solo lectura
  const isReadOnly = mode === 'view';

  // Reset form cuando cambia el modo o se cierra
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setNotification({ show: false, message: '', type: 'success' });
    }
  }, [isOpen, resetForm]);

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCancel}
      title={getModalTitle()}
      width={500}
    >
      <Stack 
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            padding: '24px',
            height: '100%',
            overflow: 'auto'
          }
        }}
      >
        {/* Notificación */}
        {notification.show && (
          <MessageBar
            messageBarType={
              notification.type === 'success' ? MessageBarType.success :
              notification.type === 'error' ? MessageBarType.error :
              MessageBarType.warning
            }
            onDismiss={() => setNotification(prev => ({ ...prev, show: false }))}
            dismissButtonAriaLabel="Cerrar"
          >
            {notification.message}
          </MessageBar>
        )}

        {/* Loading State */}
        {(permisoLoading || modulosLoading) && (
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Spinner size={SpinnerSize.medium} />
            <Text>Cargando información...</Text>
          </Stack>
        )}

        {/* Error State */}
        {permisoError && (
          <MessageBar messageBarType={MessageBarType.error}>
            Error al cargar el permiso: {permisoError}
          </MessageBar>
        )}

        {/* Formulario */}
        {!permisoLoading && !modulosLoading && !permisoError && (
          <>
            {/* Información básica */}
            <Stack tokens={{ childrenGap: 16 }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="Permissions" style={{ fontSize: '18px', color: '#106ebe' }} />
                <Text variant="mediumPlus" style={{ fontWeight: 600 }}>
                  Información del Permiso
                </Text>
              </Stack>
              
              <Separator />

              {/* Código del Permiso - Solo en modo ver */}
              {mode === 'view' && permisoData && (
                <TextField
                  label="Código del Permiso"
                  value={permisoData.codigoPermiso}
                  readOnly
                  styles={{
                    root: { maxWidth: '100%' },
                    field: { backgroundColor: '#f3f2f1' }
                  }}
                />
              )}

              {/* Nombre del Permiso */}
              <TextField
                label="Nombre del Permiso"
                placeholder="Ingrese el nombre del permiso"
                value={formData.nombre}
                onChange={(_, newValue) => updateField('nombre', newValue || '')}
                errorMessage={validationErrors.nombre}
                required={!isReadOnly}
                readOnly={isReadOnly}
                styles={{
                  root: { maxWidth: '100%' },
                  field: isReadOnly ? { backgroundColor: '#f3f2f1' } : {}
                }}
              />

              {/* Código del Permiso */}
              <TextField
                label="Código del Permiso"
                placeholder="Ingrese el código único del permiso (ej: ADMIN-USUARIOS-MENU)"
                value={formData.codigoPermiso}
                onChange={(_, newValue) => updateField('codigoPermiso', newValue || '')}
                errorMessage={validationErrors.codigoPermiso}
                required={!isReadOnly}
                readOnly={isReadOnly}
                styles={{
                  root: { maxWidth: '100%' },
                  field: isReadOnly ? { backgroundColor: '#f3f2f1' } : {}
                }}
              />

              {/* Descripción */}
              <TextField
                label="Descripción"
                placeholder="Ingrese la descripción del permiso"
                value={formData.descripcion}
                onChange={(_, newValue) => updateField('descripcion', newValue || '')}
                errorMessage={validationErrors.descripcion}
                required={!isReadOnly}
                readOnly={isReadOnly}
                multiline
                rows={3}
                styles={{
                  root: { maxWidth: '100%' },
                  field: isReadOnly ? { backgroundColor: '#f3f2f1' } : {}
                }}
              />

              {/* Módulo */}
              {isReadOnly ? (
                <TextField
                  label="Módulo"
                  value={formData.modulo}
                  readOnly
                  styles={{
                    root: { maxWidth: '100%' },
                    field: { backgroundColor: '#f3f2f1' }
                  }}
                />
              ) : (
                <Dropdown
                  label="Módulo"
                  placeholder="Seleccione un módulo"
                  options={modulosOptions}
                  selectedKey={formData.modulo}
                  onChange={(_, option) => updateField('modulo', option?.key as string || '')}
                  errorMessage={validationErrors.modulo}
                  required
                  styles={{ root: { maxWidth: '100%' } }}
                />
              )}

              {/* Estado - Solo en editar y ver */}
              {(mode === 'edit' || mode === 'view') && 'isActive' in formData && (
                <Stack tokens={{ childrenGap: 8 }}>
                  <Label required={false}>Estado del Permiso</Label>
                  <Toggle
                    label={formData.isActive ? 'Activo' : 'Inactivo'}
                    checked={formData.isActive}
                    onChange={(_, checked) => updateField('isActive', checked || false)}
                    disabled={isReadOnly}
                    onText="Activo"
                    offText="Inactivo"
                  />
                </Stack>
              )}
            </Stack>

            {/* Información adicional - Solo en modo ver */}
            {mode === 'view' && permisoData && (
              <Stack tokens={{ childrenGap: 16 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <Icon iconName="Info" style={{ fontSize: '18px', color: '#106ebe' }} />
                  <Text variant="mediumPlus" style={{ fontWeight: 600 }}>
                    Información Adicional
                  </Text>
                </Stack>
                
                <Separator />

                {/* Número de Roles */}
                <TextField
                  label="Roles Asignados"
                  value={permisoData.numeroRoles.toString()}
                  readOnly
                  styles={{
                    root: { maxWidth: '100%' },
                    field: { backgroundColor: '#f3f2f1' }
                  }}
                />

                {/* Información de auditoría */}
                <Stack horizontal tokens={{ childrenGap: 16 }}>
                  <TextField
                    label="Creado por"
                    value={permisoData.createdBy}
                    readOnly
                    styles={{
                      root: { flex: 1 },
                      field: { backgroundColor: '#f3f2f1' }
                    }}
                  />
                  <TextField
                    label="Fecha de creación"
                    value={new Date(permisoData.createdOn).toLocaleDateString('es-ES')}
                    readOnly
                    styles={{
                      root: { flex: 1 },
                      field: { backgroundColor: '#f3f2f1' }
                    }}
                  />
                </Stack>

                {permisoData.updatedBy && permisoData.updatedOn && (
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="Actualizado por"
                      value={permisoData.updatedBy}
                      readOnly
                      styles={{
                        root: { flex: 1 },
                        field: { backgroundColor: '#f3f2f1' }
                      }}
                    />
                    <TextField
                      label="Fecha de actualización"
                      value={new Date(permisoData.updatedOn).toLocaleDateString('es-ES')}
                      readOnly
                      styles={{
                        root: { flex: 1 },
                        field: { backgroundColor: '#f3f2f1' }
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            )}

            {/* Botones de acción */}
            <Stack 
              horizontal 
              horizontalAlign="end" 
              tokens={{ childrenGap: 12 }}
              styles={{
                root: {
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #edebe9'
                }
              }}
            >
              <DefaultButton
                text="Cancelar"
                onClick={handleCancel}
                disabled={isSubmitting}
              />
              {!isReadOnly && (
                <PrimaryButton
                  text={mode === 'create' ? 'Crear Permiso' : 'Guardar Cambios'}
                  onClick={handleSave}
                  disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                  iconProps={{ iconName: mode === 'create' ? 'Add' : 'Save' }}
                />
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Drawer>
  );
};