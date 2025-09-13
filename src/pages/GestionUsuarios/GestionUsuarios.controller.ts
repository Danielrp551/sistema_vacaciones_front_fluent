import { useState, useCallback } from 'react';
import { 
  useUsuariosAdmin,
  useUsuarioDetalle,
  useUsuariosDropdowns,
  useUsuarioOperations
} from '../../hooks/useUsuariosAdmin';
import { useToggleUserStatus, useResetPassword } from '../../hooks/useGestionUsuarios';
import type { UsuarioAdmin, UsuariosAdminQueryObject, DepartamentoSimple, UsuarioSimple } from '../../types/usuarios';
import type { IDropdownOption } from '@fluentui/react';

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  selectedUserId: string | null;
}

export interface ToggleStatusModalState {
  isOpen: boolean;
  selectedUsuario: UsuarioAdmin | null;
}

export interface ResetPasswordModalState {
  isOpen: boolean;
  selectedUsuario: UsuarioAdmin | null;
  contrasenaTemporal: string | null;
}

export interface UseGestionUsuariosControllerReturn {
  // Estado de datos
  usuarios: UsuarioAdmin[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  query: UsuariosAdminQueryObject;
  selectedUser: any | null;
  
  // Datos para filtros
  departamentos: DepartamentoSimple[];
  roles: string[];
  jefes: UsuarioSimple[];
  departamentosOptions: IDropdownOption[];
  rolesOptions: IDropdownOption[];
  estadosOptions: IDropdownOption[];
  
  // Estado de UI
  isLoading: boolean;
  isUserLoading: boolean;
  isDropdownsLoading: boolean;
  isOperationLoading: boolean;
  modal: ModalState;
  toggleStatusModal: ToggleStatusModalState;
  resetPasswordModal: ResetPasswordModalState;
  
  // Estados del toggle status
  isTogglingUserStatus: boolean;
  toggleUserStatusError: string | null;
  
  // Estados del reset password
  isResettingPassword: boolean;
  resetPasswordError: string | null;
  
  // Acciones de datos
  changePage: (page: number) => void;
  changePageSize: (size: number) => void;
  applyFilters: (filters: Partial<UsuariosAdminQueryObject>) => void;
  changeSorting: (sortBy: string, isDescending?: boolean) => void;
  clearFilters: () => void;
  refresh: () => void;
  
  // Acciones de modal
  openCreateModal: () => void;
  openEditModal: (usuario: UsuarioAdmin) => void;
  openViewModal: (usuario: UsuarioAdmin) => void;
  closeModal: () => void;
  
  // Acciones de toggle status modal
  openToggleStatusModal: (usuario: UsuarioAdmin) => void;
  closeToggleStatusModal: () => void;
  confirmToggleStatus: () => void;
  
  // Acciones de reset password modal
  openResetPasswordModal: (usuario: UsuarioAdmin) => void;
  closeResetPasswordModal: () => void;
  confirmResetPassword: (motivo?: string) => void;
  
  // Acciones de CRUD
  handleToggleStatus: (usuario: UsuarioAdmin) => Promise<void>;
  handleResetPassword: (usuario: UsuarioAdmin) => Promise<void>;
  
  // Acciones de notificación (removidas - se usan las del Snackbar del componente)
  
  // Callbacks de modal
  handleModalSuccess: (message: string) => void;
  handleModalError: (error: string) => void;
  
  // Estadísticas
  estadisticas: {
    totalUsuarios: number;
    usuariosActivos: number;
    usuariosInactivos: number;
    usuariosAdmins: number;
  };
}

export const useGestionUsuariosController = (
  showSuccess: (message: string) => void,
  showError: (message: string) => void
): UseGestionUsuariosControllerReturn => {
  // Estados locales (removido notification state)
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    selectedUserId: null
  });

  const [toggleStatusModal, setToggleStatusModal] = useState<ToggleStatusModalState>({
    isOpen: false,
    selectedUsuario: null
  });

  const [resetPasswordModal, setResetPasswordModal] = useState<ResetPasswordModalState>({
    isOpen: false,
    selectedUsuario: null,
    contrasenaTemporal: null
  });

  // Hooks de datos
  const {
    usuarios,
    loading: isLoading,
    totalCount,
    currentPage,
    pageSize,
    query,
    estadisticas: estadisticasBackend,
    changePage,
    changePageSize,
    applyFilters,
    changeSorting: originalChangeSorting,
    clearFilters,
    refresh
  } = useUsuariosAdmin();

  const {
    usuario: selectedUser,
    loading: isUserLoading
  } = useUsuarioDetalle(modal.selectedUserId);

  const {
    departamentos,
    roles,
    jefes,
    loading: isDropdownsLoading
  } = useUsuariosDropdowns();

  const {
    loading: isOperationLoading
  } = useUsuarioOperations((message) => showSuccess(message));

  const {
    isTogglingUserStatus,
    toggleUserStatusError,
    toggleUserStatus,
    clearToggleUserStatusError
  } = useToggleUserStatus();

  const {
    isResettingPassword,
    resetPasswordError,
    resetPassword,
    clearResetPasswordError
  } = useResetPassword();

  // Mapeo de columnas del frontend al backend
  const mapColumnKeyToBackendField = useCallback((columnKey: string): string => {
    const columnMapping: Record<string, string> = {
      'usuario': 'nombrecompleto',
      'dni': 'dni',
      'departamento': 'departamento',
      'fechaIngreso': 'fechaingreso',
      'estado': 'estado'
    };
    
    return columnMapping[columnKey] || columnKey;
  }, []);

  // Wrapper para changeSorting que mapea las columnas
  const changeSorting = useCallback((columnKey: string, isDescending?: boolean) => {
    const backendField = mapColumnKeyToBackendField(columnKey);
    originalChangeSorting(backendField, isDescending);
  }, [mapColumnKeyToBackendField, originalChangeSorting]);

  // Opciones para dropdowns
  const departamentosOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los departamentos' },
    ...departamentos.map(dep => ({ 
      key: dep.id, 
      text: dep.nombre 
    }))
  ];

  const rolesOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los roles' },
    ...roles.map(rol => ({ 
      key: rol, 
      text: rol 
    }))
  ];

  const estadosOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los estados' },
    { key: 'Activo', text: 'Activo' },
    { key: 'Inactivo', text: 'Inactivo' }
  ];

  // Funciones de modal
  const openCreateModal = useCallback(() => {
    setModal({
      isOpen: true,
      mode: 'create',
      selectedUserId: null
    });
  }, []);

  const openEditModal = useCallback((usuario: UsuarioAdmin) => {
    setModal({
      isOpen: true,
      mode: 'edit',
      selectedUserId: usuario.id
    });
  }, []);

  const openViewModal = useCallback((usuario: UsuarioAdmin) => {
    setModal({
      isOpen: true,
      mode: 'view',
      selectedUserId: usuario.id
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      mode: 'create',
      selectedUserId: null
    });
  }, []);

  // Funciones de toggle status modal
  const openToggleStatusModal = useCallback((usuario: UsuarioAdmin) => {
    setToggleStatusModal({
      isOpen: true,
      selectedUsuario: usuario
    });
  }, []);

  const closeToggleStatusModal = useCallback(() => {
    setToggleStatusModal({
      isOpen: false,
      selectedUsuario: null
    });
    clearToggleUserStatusError();
  }, [clearToggleUserStatusError]);

  const confirmToggleStatus = useCallback(() => {
    if (toggleStatusModal.selectedUsuario) {
      toggleUserStatus(
        toggleStatusModal.selectedUsuario.id,
        (message) => {
          showSuccess(message);
          closeToggleStatusModal();
          refresh();
        },
        () => {
          // El error se maneja automáticamente por el hook
        }
      );
    }
  }, [toggleStatusModal.selectedUsuario, toggleUserStatus, showSuccess, closeToggleStatusModal, refresh]);

  // Funciones de reset password modal
  const openResetPasswordModal = useCallback((usuario: UsuarioAdmin) => {
    setResetPasswordModal({
      isOpen: true,
      selectedUsuario: usuario,
      contrasenaTemporal: null
    });
  }, []);

  const closeResetPasswordModal = useCallback(() => {
    setResetPasswordModal({
      isOpen: false,
      selectedUsuario: null,
      contrasenaTemporal: null
    });
    clearResetPasswordError();
  }, [clearResetPasswordError]);

  const confirmResetPassword = useCallback((motivo?: string) => {
    if (resetPasswordModal.selectedUsuario) {
      const resetData = {
        usuarioId: resetPasswordModal.selectedUsuario.id,
        ...(motivo && { motivo })
      };
      
      resetPassword(
        resetPasswordModal.selectedUsuario.id,
        resetData,
        (message, response) => {
          // Actualizar el modal con la contraseña temporal
          setResetPasswordModal(prev => ({
            ...prev,
            contrasenaTemporal: response.contrasenaTemporal
          }));
          showSuccess(message);
          refresh();
        },
        () => {
          // El error se maneja automáticamente por el hook
        }
      );
    }
  }, [resetPasswordModal.selectedUsuario, resetPassword, showSuccess, refresh, clearResetPasswordError]);

  // Funciones de CRUD
  const handleToggleStatus = useCallback(async (usuario: UsuarioAdmin) => {
    openToggleStatusModal(usuario);
  }, [openToggleStatusModal]);

  const handleResetPassword = useCallback(async (usuario: UsuarioAdmin) => {
    openResetPasswordModal(usuario);
  }, [openResetPasswordModal]);

  // Callbacks de modal
  const handleModalSuccess = useCallback((message: string) => {
    showSuccess(message);
    refresh();
    closeModal();
  }, [showSuccess, refresh, closeModal]);

  const handleModalError = useCallback((error: string) => {
    showError(error);
  }, [showError]);

  // Estadísticas del backend (si están disponibles) o calculadas como fallback
  const usuariosAdmins = usuarios.filter(u => {
    // Revisar en el array de roles
    if (u.roles && u.roles.length > 0) {
      return u.roles.some(rol => 
        rol === 'Admin' || 
        rol === 'Administrador' || 
        rol === 'SuperAdmin' || 
        rol === 'Super Admin'
      );
    }
    // Fallback al rol individual
    return u.rol === 'Admin' || u.rol === 'Administrador' || u.rol === 'SuperAdmin';
  }).length;

  const estadisticas = estadisticasBackend ? {
    ...estadisticasBackend,
    usuariosAdmins // Agregar campo calculado localmente
  } : {
    totalUsuarios: totalCount,
    usuariosActivos: usuarios.filter(u => u.estado === 'Activo').length,
    usuariosInactivos: usuarios.filter(u => u.estado === 'Inactivo').length,
    usuariosForzarCambio: 0,
    usuariosPendientesCambioContrasena: 0,
    usuariosExtranjeros: usuarios.filter(u => u.extranjero).length,
    usuariosConJefe: usuarios.filter(u => u.manager).length,
    porcentajeActivos: totalCount > 0 ? Math.round((usuarios.filter(u => u.estado === 'Activo').length / totalCount) * 100) : 0,
    porcentajeExtranjeros: totalCount > 0 ? Math.round((usuarios.filter(u => u.extranjero).length / totalCount) * 100) : 0,
    usuariosAdmins
  };

  return {
    // Estado de datos
    usuarios,
    totalCount,
    currentPage,
    pageSize,
    query,
    selectedUser,
    
    // Datos para filtros
    departamentos,
    roles,
    jefes,
    departamentosOptions,
    rolesOptions,
    estadosOptions,
    
    // Estado de UI
    isLoading,
    isUserLoading,
    isDropdownsLoading,
    isOperationLoading,
    modal,
    toggleStatusModal,
    resetPasswordModal,
    
    // Estados del toggle status
    isTogglingUserStatus,
    toggleUserStatusError,
    
    // Estados del reset password
    isResettingPassword,
    resetPasswordError,
    
    // Acciones de datos
    changePage,
    changePageSize,
    applyFilters,
    changeSorting,
    clearFilters,
    refresh,
    
    // Acciones de modal
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    
    // Acciones de toggle status modal
    openToggleStatusModal,
    closeToggleStatusModal,
    confirmToggleStatus,
    
    // Acciones de reset password modal
    openResetPasswordModal,
    closeResetPasswordModal,
    confirmResetPassword,
    
    // Acciones de CRUD
    handleToggleStatus,
    handleResetPassword,
    
    // Callbacks de modal
    handleModalSuccess,
    handleModalError,
    
    // Estadísticas
    estadisticas,
  };
};
