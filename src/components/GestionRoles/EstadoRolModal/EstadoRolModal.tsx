import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Icon,
  Separator,
} from '@fluentui/react';
import { Drawer } from '../../Common/Drawer';
import { useCambiarEstadoRol } from '../../../hooks/useRolesAdmin';
import type { RolAdmin } from '../../../types/roles';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface EstadoRolModalProps {
  isOpen: boolean;
  rol: RolAdmin | null;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const EstadoRolModal: React.FC<EstadoRolModalProps> = ({
  isOpen,
  rol,
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

  // Hook para cambiar estado
  const { loading, error, cambiarEstado } = useCambiarEstadoRol(() => {
    showNotification('Estado del rol cambiado exitosamente', 'success');
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1500);
  });

  // Funciones auxiliares
  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleConfirm = async () => {
    if (!rol) return;
    
    try {
      await cambiarEstado(rol.id);
    } catch (error) {
      showNotification('Error al cambiar el estado del rol', 'error');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Reset notification cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setNotification({ show: false, message: '', type: 'success' });
    }
  }, [isOpen]);

  // Determinar configuración según el estado actual
  const isActive = rol?.estado?.toLowerCase() === 'activo';
  const action = isActive ? 'desactivar' : 'activar';
  const newState = isActive ? 'inactivo' : 'activo';
  const iconName = isActive ? 'StatusCircleErrorX' : 'StatusCircleCheckmark';
  const iconColor = isActive ? '#d13438' : '#107c10';

  // Configuración del título del modal
  const getModalTitle = (): string => {
    return `${action.charAt(0).toUpperCase() + action.slice(1)} Rol`;
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  if (!rol) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCancel}
      title={getModalTitle()}
      width={450}
    >
      <Stack 
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            height: '100%',
            padding: '0 4px'
          }
        }}
      >
        {/* Notificación */}
        {notification.show && (
          <MessageBar
            messageBarType={
              notification.type === 'success' 
                ? MessageBarType.success 
                : notification.type === 'error'
                ? MessageBarType.error
                : MessageBarType.warning
            }
            isMultiline={false}
            onDismiss={() => setNotification(prev => ({ ...prev, show: false }))}
          >
            {notification.message}
          </MessageBar>
        )}

        {/* Error del hook */}
        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={true}
          >
            {error}
          </MessageBar>
        )}

        {/* Contenido principal */}
        <Stack tokens={{ childrenGap: 20 }}>
          {/* Información del rol */}
          <Stack 
            horizontalAlign="center" 
            tokens={{ childrenGap: 16 }}
            styles={{
              root: {
                padding: '20px',
                border: '1px solid #e1dfdd',
                borderRadius: '6px',
                backgroundColor: '#faf9f8'
              }
            }}
          >
            <Icon 
              iconName={iconName}
              styles={{
                root: {
                  fontSize: '48px',
                  color: iconColor
                }
              }}
            />
            
            <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }}>
              <Text variant="large" styles={{ root: { fontWeight: '600' } }}>
                {rol.name}
              </Text>
              <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
                Estado actual: <strong style={{ color: isActive ? '#107c10' : '#d13438' }}>
                  {rol.estado}
                </strong>
              </Text>
            </Stack>
          </Stack>

          {/* Mensaje de confirmación */}
          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
              ¿Está seguro que desea {action} este rol?
            </Text>
            
            <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
              El rol pasará al estado <strong>{newState}</strong>. 
              {isActive && ' Los usuarios con este rol mantendrán sus asignaciones pero el rol estará inactivo.'}
              {!isActive && ' El rol volverá a estar disponible para asignaciones.'}
            </Text>

            {/* Advertencia si tiene usuarios */}
            {rol.numeroPersonas > 0 && (
              <MessageBar
                messageBarType={MessageBarType.warning}
                isMultiline={true}
              >
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text styles={{ root: { fontWeight: '600' } }}>
                    ⚠️ Este rol tiene {rol.numeroPersonas} usuario(s) asignado(s)
                  </Text>
                  <Text>
                    {isActive 
                      ? 'Al desactivarlo, los usuarios mantendrán el rol pero estará inactivo.'
                      : 'Al activarlo, el rol volverá a estar disponible para estos usuarios.'
                    }
                  </Text>
                </Stack>
              </MessageBar>
            )}
          </Stack>

          <Separator />

          {/* Botones de acción */}
          <Stack
            horizontal
            horizontalAlign="end"
            tokens={{ childrenGap: 12 }}
            styles={{
              root: {
                marginTop: 'auto',
                paddingTop: '16px'
              }
            }}
          >
            <DefaultButton
              text="Cancelar"
              onClick={handleCancel}
              disabled={loading}
            />
            
            <PrimaryButton
              text={loading ? 'Procesando...' : `${action.charAt(0).toUpperCase() + action.slice(1)} Rol`}
              onClick={handleConfirm}
              disabled={loading}
              iconProps={loading ? undefined : { iconName: iconName }}
              styles={{
                root: {
                  backgroundColor: iconColor,
                  borderColor: iconColor
                },
                rootHovered: {
                  backgroundColor: iconColor,
                  borderColor: iconColor,
                  opacity: 0.9
                }
              }}
            />
          </Stack>

          {/* Loading spinner */}
          {loading && (
            <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }}>
              <Spinner size={SpinnerSize.medium} />
              <Text variant="medium">Cambiando estado del rol...</Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
