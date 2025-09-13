import React, { useState, useEffect } from 'react';
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
} from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { Drawer } from '../../Common/Drawer';
import { useRolForm, usePermisos, useRolById } from '../../../hooks/useRolesAdmin';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type RolModalMode = 'create' | 'edit' | 'view';

export interface RolModalProps {
  isOpen: boolean;
  mode: RolModalMode;
  rolId?: string; // Cambio: usar rolId en lugar de rolData
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const RolModal: React.FC<RolModalProps> = ({
  isOpen,
  mode,
  rolId,
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

  // Hooks
  const { permisos, loading: permisosLoading } = usePermisos();
  
  // Hook para obtener datos del rol (en modo editar/ver)
  const { 
    rol: rolData, 
    loading: rolLoading, 
    error: rolError 
  } = useRolById(mode !== 'create' ? rolId || null : null);
  
  const {
    formData,
    validationErrors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm,
    isEditing
  } = useRolForm(
    (mode === 'edit' || mode === 'view') ? (rolData || undefined) : undefined,
    () => {
      showNotification('Rol guardado exitosamente', 'success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    },
    (error: string) => {
      showNotification(error, 'error');
    }
  );

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
    resetForm();
    onClose();
  };

  // Configuración de opciones para dropdown de permisos
  const permisosOptions: IDropdownOption[] = permisos.map(permiso => ({
    key: permiso.id,
    text: permiso.nombreRuta, // Cambio: usar nombreRuta en lugar de nombre
    data: permiso
  }));

  // Configuración del título del modal
  const getModalTitle = (): string => {
    switch (mode) {
      case 'create':
        return 'Crear Nuevo Rol';
      case 'edit':
        return 'Editar Rol';
      case 'view':
        return 'Detalles del Rol';
      default:
        return 'Gestión de Rol';
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
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }
        }}
      >
        {/* Notificaciones */}
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

        {/* Loading de permisos */}
        {permisosLoading && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Spinner size={SpinnerSize.small} />
            <Text variant="medium">Cargando permisos...</Text>
          </Stack>
        )}

        {/* Loading de datos del rol */}
        {rolLoading && mode !== 'create' && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Spinner size={SpinnerSize.small} />
            <Text variant="medium">Cargando datos del rol...</Text>
          </Stack>
        )}

        {/* Error al cargar rol */}
        {rolError && mode !== 'create' && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={() => {}}
            dismissButtonAriaLabel="Cerrar"
          >
            Error al cargar el rol: {rolError}
          </MessageBar>
        )}

        {/* Formulario */}
        <Stack 
          tokens={{ childrenGap: 16 }}
          styles={{
            root: {
              width: '100%',
              maxWidth: '100%'
            }
          }}
        >
          {/* Información básica */}
          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
              Información del Rol
            </Text>
            <Separator />
          </Stack>

          {/* Campo Nombre */}
          <TextField
            label="Nombre del Rol"
            required={!isReadOnly}
            value={formData.name}
            onChange={(_, newValue) => updateField('name', newValue || '')}
            errorMessage={validationErrors.name}
            disabled={isSubmitting || isReadOnly}
            placeholder={isReadOnly ? '' : 'Ingrese el nombre del rol'}
            readOnly={isReadOnly}
            styles={{
              fieldGroup: isReadOnly ? { backgroundColor: '#f8f8f8' } : undefined
            }}
          />

          {/* Campo Descripción */}
          <TextField
            label="Descripción"
            required={!isReadOnly}
            value={formData.descripcion}
            onChange={(_, newValue) => updateField('descripcion', newValue || '')}
            errorMessage={validationErrors.descripcion}
            disabled={isSubmitting || isReadOnly}
            placeholder={isReadOnly ? '' : 'Ingrese una descripción para el rol'}
            multiline
            rows={3}
            readOnly={isReadOnly}
            styles={{
              fieldGroup: isReadOnly ? { backgroundColor: '#f8f8f8' } : undefined
            }}
          />

          {/* Sección de Permisos */}
          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
              Permisos Asignados
            </Text>
            <Separator />
          </Stack>

          {/* Dropdown de Permisos */}
          <Stack tokens={{ childrenGap: 8 }}>
            <Label required={!isReadOnly}>Seleccionar Permisos</Label>
            <Dropdown
              multiSelect
              options={permisosOptions}
              selectedKeys={formData.permisos}
              onChange={(_, option) => {
                if (option) {
                  const currentPermisos = [...formData.permisos];
                  if (option.selected) {
                    currentPermisos.push(option.key as string);
                  } else {
                    const index = currentPermisos.indexOf(option.key as string);
                    if (index > -1) {
                      currentPermisos.splice(index, 1);
                    }
                  }
                  updateField('permisos', currentPermisos);
                }
              }}
              placeholder={isReadOnly ? 'Sin permisos asignados' : 'Seleccione los permisos para este rol'}
              disabled={isSubmitting || isReadOnly || permisosLoading}
              errorMessage={validationErrors.permisos}
              styles={{
                dropdown: isReadOnly ? { backgroundColor: '#f8f8f8' } : undefined
              }}
            />

            {/* Lista de permisos seleccionados */}
            {formData.permisos.length > 0 && (
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="medium" styles={{ root: { fontWeight: 500 } }}>
                  Permisos seleccionados ({formData.permisos.length}):
                </Text>
                <Stack
                  horizontal
                  wrap
                  tokens={{ childrenGap: 8 }}
                  styles={{ 
                    root: { 
                      padding: '8px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      width: '100%',
                      maxWidth: '100%',
                      boxSizing: 'border-box'
                    } 
                  }}
                >
                  {formData.permisos.map(permisoId => {
                    const permiso = permisos.find(p => p.id === permisoId);
                    return permiso ? (
                      <Stack
                        key={permisoId}
                        horizontal
                        verticalAlign="center"
                        tokens={{ childrenGap: 4 }}
                        styles={{
                          root: {
                            padding: '4px 8px',
                            backgroundColor: '#e1f5fe',
                            borderRadius: '12px',
                            border: '1px solid #b3e5fc',
                            maxWidth: '100%',
                            flexShrink: 1
                          }
                        }}
                      >
                        <Icon iconName="Shield" styles={{ root: { fontSize: '12px', color: '#0277bd' } }} />
                        <Text 
                          variant="small" 
                          styles={{ 
                            root: { 
                              color: '#0277bd', 
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            } 
                          }}
                        >
                          {permiso.nombreRuta}
                        </Text>
                      </Stack>
                    ) : null;
                  })}
                </Stack>
              </Stack>
            )}
          </Stack>

          {/* Información adicional en modo vista */}
          {mode === 'view' && rolData && (
            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
                Información Adicional
              </Text>
              <Separator />
              
              <Stack horizontal tokens={{ childrenGap: 24 }}>
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
                    Usuarios asignados
                  </Text>
                  <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
                    {rolData.numeroPersonas || 0}
                  </Text>
                </Stack>
                
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
                    Estado
                  </Text>
                  <Text 
                    variant="medium" 
                    styles={{ 
                      root: { 
                        fontWeight: 600,
                        color: (rolData.estado?.toLowerCase() === 'activo') ? '#107c10' : '#d13438'
                      } 
                    }}
                  >
                    {rolData.estado || 'Activo'}
                  </Text>
                </Stack>
              </Stack>

              <Stack tokens={{ childrenGap: 4 }}>
                <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
                  Creado por
                </Text>
                <Text variant="medium">
                  {rolData.createdBy} el {new Date(rolData.createdOn).toLocaleDateString()}
                </Text>
              </Stack>

              {rolData.updatedBy && (
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
                    Última modificación
                  </Text>
                  <Text variant="medium">
                    {rolData.updatedBy} el {new Date(rolData.updatedOn!).toLocaleDateString()}
                  </Text>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>

        {/* Botones de acción */}
        <Separator />
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
          <DefaultButton
            text="Cancelar"
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          
          {!isReadOnly && (
            <PrimaryButton
              text={isEditing ? 'Actualizar Rol' : 'Crear Rol'}
              onClick={handleSave}
              disabled={isSubmitting || permisosLoading}
              iconProps={{ iconName: isSubmitting ? 'More' : (isEditing ? 'Save' : 'Add') }}
            >
              {isSubmitting && (
                <Spinner size={SpinnerSize.xSmall} styles={{ root: { marginRight: '8px' } }} />
              )}
            </PrimaryButton>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
