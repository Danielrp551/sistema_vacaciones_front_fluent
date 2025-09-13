// ============================================================================
// CONTROLADOR PARA LA PÁGINA DE GESTIÓN DE ROLES
// ============================================================================
// Este controlador maneja toda la lógica de estado y operaciones para 
// la página de gestión de roles, incluyendo modales y notificaciones
// ============================================================================

import { useState, useCallback } from 'react';
import { 
  useRolesAdmin,
  usePermisos
} from '../../hooks/useRolesAdmin';
import { useAuditoriaRoles } from '../../hooks/useAuditoriaRoles';
import type { 
  RolAdmin, 
  RolesAdminQueryObject, 
  Permiso
} from '../../types/roles';
import type { IDropdownOption } from '@fluentui/react';

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  selectedRolId: string | null;
}

export interface EstadoRolModalState {
  isOpen: boolean;
  selectedRol: RolAdmin | null;
}

export interface UseGestionRolesControllerReturn {
  // Estado de datos
  roles: RolAdmin[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  query: RolesAdminQueryObject;
  permisos: Permiso[];
  
  // Estado de UI
  isLoading: boolean;
  isPermisosLoading: boolean;
  modal: ModalState;
  estadoModal: EstadoRolModalState;
  notification: NotificationState;
  
  // Opciones para filtros
  permisosOptions: IDropdownOption[];
  
  // Funciones de navegación y filtros
  changePage: (page: number) => void;
  changePageSize: (size: number) => void;
  applyFilters: (filters: Partial<RolesAdminQueryObject>) => void;
  changeSorting: (sortBy: string, isDescending?: boolean) => void;
  clearFilters: () => void;
  refreshRoles: () => void;
  
  // Funciones de modales
  openCreateModal: () => void;
  openEditModal: (rolId: string) => void;
  openViewModal: (rolId: string) => void;
  closeModal: () => void;
  
  // Funciones de cambio de estado
  openEstadoModal: (rol: RolAdmin) => void;
  closeEstadoModal: () => void;
  
  // Funciones de notificaciones
  closeNotification: () => void;
  showNotification: (message: string, type: NotificationState['type']) => void;
  
  // Datos de auditoría
  auditoria: {
    auditorias: any[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    changePage: (page: number) => void;
    changePageSize: (size: number) => void;
    refresh: () => void;
  };
}

export const useGestionRolesController = (): UseGestionRolesControllerReturn => {
  // Hooks principales
  const {
    roles,
    loading: isLoading,
    totalCount,
    currentPage,
    pageSize,
    query,
    changePage,
    changePageSize,
    applyFilters,
    changeSorting: originalChangeSorting,
    clearFilters,
    refresh: refreshRoles
  } = useRolesAdmin();

  const {
    permisos,
    loading: isPermisosLoading
  } = usePermisos();

  // Hook de auditoría
  const auditoriaHook = useAuditoriaRoles();

  // Mapeo de columnas del frontend al backend
  const mapColumnKeyToBackendField = useCallback((columnKey: string): string => {
    const columnMapping: Record<string, string> = {
      'name': 'name',
      'usuariosCount': 'usuarios'
    };
    
    return columnMapping[columnKey] || columnKey;
  }, []);

  // Wrapper para changeSorting que mapea las columnas
  const changeSorting = useCallback((columnKey: string, isDescending?: boolean) => {
    const backendField = mapColumnKeyToBackendField(columnKey);
    originalChangeSorting(backendField, isDescending);
  }, [mapColumnKeyToBackendField, originalChangeSorting]);

  // Estados locales
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    selectedRolId: null
  });

  const [estadoModal, setEstadoModal] = useState<EstadoRolModalState>({
    isOpen: false,
    selectedRol: null
  });

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Opciones para dropdowns
  const permisosOptions: IDropdownOption[] = permisos.map(permiso => ({
    key: permiso.id,
    text: permiso.nombreRuta // Cambio: usar nombreRuta en lugar de nombre
  }));

  // Funciones de modales
  const openCreateModal = useCallback(() => {
    setModal({
      isOpen: true,
      mode: 'create',
      selectedRolId: null
    });
  }, []);

  const openEditModal = useCallback((rolId: string) => {
    setModal({
      isOpen: true,
      mode: 'edit',
      selectedRolId: rolId
    });
  }, []);

  const openViewModal = useCallback((rolId: string) => {
    setModal({
      isOpen: true,
      mode: 'view',
      selectedRolId: rolId
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      mode: 'create',
      selectedRolId: null
    });
  }, []);

  // Funciones del modal de cambio de estado
  const openEstadoModal = useCallback((rol: Permiso) => {
    setEstadoModal({
      isOpen: true,
      selectedRol: rol
    });
  }, []);

  const closeEstadoModal = useCallback(() => {
    setEstadoModal({
      isOpen: false,
      selectedRol: null
    });
  }, []);

  // Funciones de notificaciones
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationState['type']) => {
    setNotification({
      show: true,
      message,
      type
    });
  }, []);

  return {
    // Estado de datos
    roles,
    totalCount,
    currentPage,
    pageSize,
    query,
    permisos,
    
    // Estado de UI
    isLoading,
    isPermisosLoading,
    modal,
    notification,
    
    // Opciones para filtros
    permisosOptions,
    
    // Funciones de navegación y filtros
    changePage,
    changePageSize,
    applyFilters,
    changeSorting,
    clearFilters,
    refreshRoles,
    
    // Funciones de modales
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    
    // Funciones de cambio de estado
    estadoModal,
    openEstadoModal,
    closeEstadoModal,
    
    // Funciones de notificaciones
    closeNotification,
    showNotification,
    
    // Datos de auditoría
    auditoria: {
      auditorias: auditoriaHook.auditorias,
      loading: auditoriaHook.loading,
      error: auditoriaHook.error,
      totalCount: auditoriaHook.totalCount,
      currentPage: auditoriaHook.currentPage,
      pageSize: auditoriaHook.pageSize,
      changePage: auditoriaHook.changePage,
      changePageSize: auditoriaHook.changePageSize,
      refresh: auditoriaHook.refresh
    }
  };
};
