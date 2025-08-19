import React from 'react';
import {
  Modal,
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Icon,
  Persona,
  PersonaSize,
} from '@fluentui/react';
import type { UsuarioAdmin } from '../../../types/usuarios';

// ============================================================================
// INTERFACES DEL COMPONENTE
// ============================================================================

interface ConfirmarToggleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  usuario: UsuarioAdmin | null;
  isLoading?: boolean;
  error?: string | null;
}

// ============================================================================
// ESTILOS DEL MODAL
// ============================================================================

const modalStyles = {
  main: {
    maxWidth: '500px',
    minHeight: 'auto',
    '@media (max-width: 768px)': {
      maxWidth: '90vw',
      margin: '0 auto',
    },
  },
};

const containerStyles = {
  root: {
    padding: '24px',
    gap: '20px',
  },
};

const headerStyles = {
  root: {
    gap: '12px',
    marginBottom: '8px',
  },
};

const iconStyles = {
  root: {
    fontSize: '24px',
    color: '#d13438', // Color de warning/danger
  },
};

const titleStyles = {
  root: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#323130',
    margin: 0,
  },
};

const subtitleStyles = {
  root: {
    fontSize: '14px',
    color: '#605e5c',
    margin: 0,
  },
};

const userInfoStyles = {
  root: {
    padding: '16px',
    backgroundColor: '#faf9f8',
    border: '1px solid #e1dfdd',
    borderRadius: '4px',
    gap: '12px',
  },
};

const warningStyles = {
  root: {
    padding: '12px',
    backgroundColor: '#fff4ce',
    border: '1px solid #ffb900',
    borderRadius: '4px',
    gap: '8px',
  },
};

const warningIconStyles = {
  root: {
    fontSize: '16px',
    color: '#797673',
  },
};

const warningTextStyles = {
  root: {
    fontSize: '14px',
    color: '#323130',
    margin: 0,
    lineHeight: '20px',
  },
};

const actionsStyles = {
  root: {
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
};

const primaryButtonStyles = {
  root: {
    backgroundColor: '#d13438',
    borderColor: '#d13438',
    minWidth: '100px',
  },
  rootHovered: {
    backgroundColor: '#a4262c',
    borderColor: '#a4262c',
  },
  rootPressed: {
    backgroundColor: '#8e2429',
    borderColor: '#8e2429',
  },
};

const confirmButtonStyles = {
  root: {
    backgroundColor: '#107c10',
    borderColor: '#107c10',
    minWidth: '100px',
  },
  rootHovered: {
    backgroundColor: '#0b5394',
    borderColor: '#0b5394',
  },
  rootPressed: {
    backgroundColor: '#094c84',
    borderColor: '#094c84',
  },
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ConfirmarToggleStatusModal: React.FC<ConfirmarToggleStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  usuario,
  isLoading = false,
  error = null,
}) => {
  
  if (!usuario) return null;

  const isActive = usuario.estado === 'Activo';
  const accionTitle = isActive ? 'Desactivar' : 'Activar';

  const getWarningMessage = (): string => {
    if (isActive) {
      return 'Al desactivar este usuario, no podrá acceder al sistema ni realizar ninguna acción. Sus datos se conservarán pero su cuenta quedará inactiva.';
    } else {
      return 'Al activar este usuario, podrá acceder nuevamente al sistema y realizar todas las acciones según sus permisos asignados.';
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      isBlocking={isLoading}
      styles={modalStyles}
      dragOptions={undefined}
    >
      <Stack styles={containerStyles}>
        {/* Header */}
        <Stack horizontal verticalAlign="center" styles={headerStyles}>
          <Icon 
            iconName={isActive ? 'UserRemove' : 'UserFollowed'} 
            styles={isActive ? iconStyles : { root: { fontSize: '24px', color: '#107c10' } }} 
          />
          <Stack>
            <Text styles={titleStyles}>
              {accionTitle} Usuario
            </Text>
            <Text styles={subtitleStyles}>
              Confirma esta acción para continuar
            </Text>
          </Stack>
        </Stack>

        {/* Error Message */}
        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            dismissButtonAriaLabel="Cerrar"
          >
            {error}
          </MessageBar>
        )}

        {/* User Information */}
        <Stack styles={userInfoStyles}>
          <Text styles={{ root: { fontSize: '14px', fontWeight: '600', color: '#323130' } }}>
            Usuario seleccionado:
          </Text>
          <Persona
            text={usuario.nombreCompleto}
            secondaryText={usuario.email}
            size={PersonaSize.size40}
            imageAlt={usuario.nombreCompleto}
          />
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontSize: '12px', color: '#605e5c' } }}>
              Estado actual:
            </Text>
            <span
              style={{
                backgroundColor: isActive ? '#e7f5e7' : '#fdf2f2',
                color: isActive ? '#0f7b0f' : '#d13438',
                border: `1px solid ${isActive ? '#0f7b0f' : '#d13438'}`,
                fontWeight: '600',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '3px',
                display: 'inline-block',
              }}
            >
              {usuario.estado}
            </span>
          </Stack>
        </Stack>

        {/* Warning */}
        <Stack horizontal styles={warningStyles}>
          <Icon iconName="Info" styles={warningIconStyles} />
          <Text styles={warningTextStyles}>
            {getWarningMessage()}
          </Text>
        </Stack>

        {/* Actions */}
        <Stack horizontal styles={actionsStyles}>
          <DefaultButton
            text="Cancelar"
            onClick={handleClose}
            disabled={isLoading}
          />
          {isLoading ? (
            <PrimaryButton
              text="Procesando..."
              disabled={true}
              styles={isActive ? primaryButtonStyles : confirmButtonStyles}
            />
          ) : (
            <PrimaryButton
              text={`${accionTitle} Usuario`}
              onClick={handleConfirm}
              styles={isActive ? primaryButtonStyles : confirmButtonStyles}
            />
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ConfirmarToggleStatusModal;
