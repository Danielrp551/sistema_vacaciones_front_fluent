import React, { useState } from 'react';
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
  TextField,
} from '@fluentui/react';
import type { UsuarioAdmin } from '../../../types/usuarios';

// ============================================================================
// INTERFACES DEL COMPONENTE
// ============================================================================

interface ReiniciarPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo?: string) => void;
  usuario: UsuarioAdmin | null;
  isLoading?: boolean;
  error?: string | null;
  contrasenaTemporal?: string | null;
}

// ============================================================================
// ESTILOS DEL MODAL
// ============================================================================

const userInfoStyles = {
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '20px',
};

const iconStyles = {
  fontSize: '24px',
  color: '#d13438',
  marginRight: '12px',
};

const successIconStyles = {
  fontSize: '24px',
  color: '#107c10',
  marginRight: '12px',
};

const buttonStyles = {
  minWidth: '120px',
};

const warningTextStyles = {
  color: '#d13438',
  fontWeight: 600,
  marginBottom: '16px',
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ReiniciarPasswordModal: React.FC<ReiniciarPasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  usuario,
  isLoading = false,
  error = null,
  contrasenaTemporal = null,
}) => {
  const [motivo, setMotivo] = useState<string>('');

  // Reset estado al cerrar
  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  // Confirmar reinicio de contraseña
  const handleConfirm = () => {
    onConfirm(motivo.trim() || undefined);
  };

  if (!usuario) return null;

  // Si ya se completó el reinicio, mostrar la nueva contraseña
  const isSuccess = contrasenaTemporal !== null;

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      isBlocking={isLoading}
      containerClassName="reiniciar-password-modal"
    >
      <Stack
        styles={{
          root: {
            minWidth: '500px',
            maxWidth: '600px',
            maxHeight: '80vh', // Limitar altura máxima al 80% del viewport
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden', // Evitar scroll en el Stack principal
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        tokens={{ childrenGap: 20 }}
      >
        {/* Header */}
        <Stack styles={{ root: { flexShrink: 0 } }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
            <Icon 
              iconName={isSuccess ? "Completed" : "Lock"} 
              style={isSuccess ? successIconStyles : iconStyles} 
            />
            <Text
              styles={{
                root: {
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#323130',
                },
              }}
            >
              {isSuccess ? 'Contraseña Reiniciada' : 'Reiniciar Contraseña'}
            </Text>
          </Stack>

          {/* Error Message */}
          {error && (
            <MessageBar
              messageBarType={MessageBarType.error}
              styles={{
                root: {
                  marginTop: '16px',
                },
              }}
            >
              {error}
            </MessageBar>
          )}
        </Stack>

        {/* Contenido con scroll */}
        <Stack 
          tokens={{ childrenGap: 16 }}
          styles={{
            root: {
              flex: 1, // Tomar el espacio disponible
              overflowY: 'auto', // Permitir scroll solo en el contenido
              paddingRight: '4px', // Espacio para la scrollbar
            },
          }}
        >

          {/* Usuario Info */}
          <div style={userInfoStyles}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
              <Persona
                text={usuario.nombreCompleto || `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim() || 'Usuario'}
                secondaryText={usuario.email}
                size={PersonaSize.size40}
                hidePersonaDetails={false}
              />
            </Stack>
          </div>

          {isSuccess ? (
            // Mostrar contraseña temporal generada
            <Stack tokens={{ childrenGap: 16 }}>
              <Text variant="mediumPlus" style={{ color: '#107c10', fontWeight: 600 }}>
                ¡Contraseña reiniciada exitosamente!
              </Text>
              
              <Text variant="medium">
                Se ha generado una nueva contraseña temporal. Comparte esta información de forma segura con el usuario:
              </Text>

              <div style={{
                padding: '16px',
                backgroundColor: '#f3f2f1',
                borderRadius: '8px',
                border: '2px solid #107c10',
              }}>
                <Text variant="medium" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  Nueva Contraseña Temporal:
                </Text>
                <Text 
                  variant="large" 
                  style={{ 
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    backgroundColor: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #d1d1d1',
                    display: 'block',
                    marginTop: '8px',
                    userSelect: 'all',
                    cursor: 'text',
                  }}
                >
                  {contrasenaTemporal}
                </Text>
              </div>

              <Text variant="small" style={{ color: '#605e5c' }}>
                • El usuario deberá cambiar esta contraseña en su primer inicio de sesión
                • Esta contraseña es temporal y caduca después del primer uso
                • Asegúrate de comunicar esta información de forma segura
              </Text>
            </Stack>
          ) : (
            // Formulario de confirmación
            <Stack tokens={{ childrenGap: 16 }}>
              <Text variant="medium" style={warningTextStyles}>
                ⚠️ Esta acción generará una nueva contraseña temporal
              </Text>
              
              <Text variant="medium">
                Al confirmar esta acción:
              </Text>

              <ul style={{ margin: '0', paddingLeft: '20px', color: '#605e5c' }}>
                <li>Se invalidará la contraseña actual del usuario</li>
                <li>Se generará una nueva contraseña temporal</li>
                <li>El usuario deberá cambiar su contraseña en el próximo inicio de sesión</li>
                <li>Recibirás la nueva contraseña para comunicársela al usuario</li>
              </ul>

              <TextField
                label="Motivo del reinicio (opcional)"
                placeholder="Ej: Usuario olvidó su contraseña"
                value={motivo}
                onChange={(_, newValue) => setMotivo(newValue || '')}
                multiline
                rows={3}
                maxLength={500}
                description="Este motivo quedará registrado para auditoría"
              />
            </Stack>
          )}
        </Stack>

        {/* Footer con botones - fuera del área de scroll */}
        <Stack styles={{ root: { flexShrink: 0 } }}>
          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }} styles={{ root: { marginTop: '20px' } }}>
            {isSuccess ? (
              <PrimaryButton
                text="Entendido"
                onClick={handleClose}
                style={buttonStyles}
              />
            ) : (
              <>
                <DefaultButton
                  text="Cancelar"
                  onClick={handleClose}
                  disabled={isLoading}
                  style={buttonStyles}
                />
                <PrimaryButton
                  text={isLoading ? "Reiniciando..." : "Reiniciar Contraseña"}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  style={buttonStyles}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ReiniciarPasswordModal;
