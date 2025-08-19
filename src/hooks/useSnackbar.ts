import { useState, useCallback } from 'react';
import type { SnackbarType } from '../components/Common/Snackbar';

// ============================================================================
// INTERFACES
// ============================================================================

export interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
}

export interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSnackbar: (message: string, type: SnackbarType) => void;
  hideSnackbar: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType) => {
    setSnackbar({
      isOpen: true,
      message,
      type
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message: string) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showWarning = useCallback((message: string) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  const showInfo = useCallback((message: string) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
