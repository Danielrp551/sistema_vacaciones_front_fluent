import React, { useEffect } from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import styles from './Snackbar.module.css';

// ============================================================================
// INTERFACES
// ============================================================================

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarProps {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
  duration?: number; // Duración en milisegundos (default: 4000)
  onClose: () => void;
  position?: 'top' | 'bottom'; // Posición en la pantalla (default: 'top')
}

// ============================================================================
// UTILIDADES
// ============================================================================

const getMessageBarType = (type: SnackbarType): MessageBarType => {
  switch (type) {
    case 'success':
      return MessageBarType.success;
    case 'error':
      return MessageBarType.error;
    case 'warning':
      return MessageBarType.warning;
    case 'info':
      return MessageBarType.info;
    default:
      return MessageBarType.info;
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const Snackbar: React.FC<SnackbarProps> = ({
  isOpen,
  message,
  type,
  duration = 4000,
  onClose,
  position = 'top'
}) => {
  // Auto-close después de la duración especificada
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`${styles.snackbarContainer} ${styles[position]}`}>
      <div className={styles.snackbarContent}>
        <MessageBar
          messageBarType={getMessageBarType(type)}
          onDismiss={onClose}
          dismissButtonAriaLabel="Cerrar notificación"
          className={styles.messageBar}
        >
          {message}
        </MessageBar>
      </div>
    </div>
  );
};

export default Snackbar;
