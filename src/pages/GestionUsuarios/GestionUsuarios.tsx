import React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  Dropdown,
  Spinner,
  SpinnerSize,
  Icon,
  IconButton,
  TooltipHost,
  Persona,
  PersonaSize,
  ContextualMenuItemType,
  Dialog,
  DialogType,
  DefaultButton,
} from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn } from '../../components/DataTable';
import { NuevoUsuarioModal, ConfirmarToggleStatusModal, ReiniciarPasswordModal } from '../../components/GestionUsuarios';
import { Snackbar } from '../../components/Common/Snackbar';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useGestionUsuariosController } from './GestionUsuarios.controller';
import type { UsuarioAdmin } from '../../types/usuarios';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
  actionButtonStyles,
  filtersContainerStyles,
  filterRowStyles,
  filterItemStyles,
  statsGridStyles,
  statCardStyles,
  statNumberStyles,
  statLabelStyles,
  tableContainerStyles,
  loadingContainerStyles,
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateMessageStyles,
  statusBadgeActiveStyles,
  statusBadgeInactiveStyles,
} from './GestionUsuarios.styles';

const GestionUsuarios: React.FC = () => {
  // Hook para Snackbar
  const { snackbar, hideSnackbar, showSuccess, showError } = useSnackbar();

  const {
    // Estado de datos
    usuarios,
    totalCount,
    currentPage,
    pageSize,
    query,
    
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
    
    // Estados del toggle status
    toggleStatusModal,
    isTogglingUserStatus,
    toggleUserStatusError,
    closeToggleStatusModal,
    confirmToggleStatus,
    
    // Estados del reset password
    resetPasswordModal,
    isResettingPassword,
    resetPasswordError,
    openResetPasswordModal,
    closeResetPasswordModal,
    confirmResetPassword,
    
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
    
    // Acciones de CRUD
    handleToggleStatus,
    handleResetPassword,
    
    // Callbacks de modal
    handleModalError,
    
    // Estadísticas
    estadisticas,
  } = useGestionUsuariosController(showSuccess, showError);

  // Función local para manejar éxito del modal usando Snackbar
  const handleModalSuccess = (message: string) => {
    showSuccess(message);
    closeModal();
    refresh();
  };

  // Renderizadores de columnas
  const renderUsuario = (usuario: UsuarioAdmin): JSX.Element => (
    <Persona
      text={usuario.nombreCompleto}
      size={PersonaSize.size40}
      imageAlt={usuario.nombreCompleto}
      onClick={() => openViewModal(usuario)}
      styles={{
        root: { cursor: 'pointer' },
        primaryText: { fontSize: '14px', fontWeight: '600' }
      }}
    />
  );

  const renderEstado = (usuario: UsuarioAdmin): JSX.Element => {
    const isActive = usuario.estado === 'Activo';
    return (
      <Text 
        styles={isActive ? statusBadgeActiveStyles : statusBadgeInactiveStyles}
      >
        {usuario.estado}
      </Text>
    );
  };

  const renderAcciones = (usuario: UsuarioAdmin): JSX.Element => {
    const menuItems: IContextualMenuItem[] = [
      {
        key: 'view',
        text: 'Ver detalles',
        iconProps: { iconName: 'View' },
        onClick: () => openViewModal(usuario),
      },
      {
        key: 'edit',
        text: 'Editar',
        iconProps: { iconName: 'Edit' },
        onClick: () => openEditModal(usuario),
      },
      {
        key: 'divider1',
        itemType: ContextualMenuItemType.Divider,
      },
      {
        key: 'toggle',
        text: usuario.estado === 'Activo' ? 'Desactivar' : 'Activar',
        iconProps: { iconName: usuario.estado === 'Activo' ? 'UserRemove' : 'UserFollowed' },
        onClick: () => {
          handleToggleStatus(usuario);
        },
      },
      {
        key: 'resetPassword',
        text: 'Reiniciar contraseña',
        iconProps: { iconName: 'PasswordField' },
        onClick: () => {
          handleResetPassword(usuario);
        },
      },
    ];

    return (
      <TooltipHost content="Acciones">
        <IconButton
          iconProps={{ iconName: 'MoreVertical' }}
          menuIconProps={{ iconName: '' }}
          menuProps={{
            items: menuItems,
            directionalHint: 6, // DirectionalHint.bottomRightEdge
          }}
          styles={{
            root: { 
              color: '#605e5c',
              width: '32px',
              height: '32px'
            }
          }}
        />
      </TooltipHost>
    );
  };

  // Definición de columnas
  const columns: DataTableColumn<UsuarioAdmin>[] = [
    {
      key: 'acciones',
      name: 'Acciones',
      minWidth: 60,
      maxWidth: 60,
      isResizable: false,
      isSortable: false,
      onRender: renderAcciones,
    },
    {
      key: 'usuario',
      name: 'Usuario',
      fieldName: 'nombreCompleto',
      minWidth: 250,
      maxWidth: 300,
      isResizable: true,
      isSorted: query.sortBy === 'nombrecompleto',
      isSortedDescending: query.sortBy === 'nombrecompleto' ? query.isDescending : false,
      onRender: renderUsuario,
    },
    {
      key: 'dni',
      name: 'DNI',
      fieldName: 'dni',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: query.sortBy === 'dni',
      isSortedDescending: query.sortBy === 'dni' ? query.isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text variant="medium">{usuario.dni || '-'}</Text>
      ),
    },
    {
      key: 'rol',
      name: 'Rol',
      fieldName: 'roles',
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      isSortable: false,
      onRender: (usuario: UsuarioAdmin) => {
        // Si tiene roles array, mostramos el primero o todos separados por coma
        if (usuario.roles && usuario.roles.length > 0) {
          return (
            <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
              {usuario.roles.join(', ')}
            </Text>
          );
        }
        // Fallback al rol principal si existe
        if (usuario.rol) {
          return (
            <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
              {usuario.rol}
            </Text>
          );
        }
        // Si no hay roles
        return (
          <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
            Sin rol
          </Text>
        );
      },
    },
    {
      key: 'departamento',
      name: 'Departamento',
      fieldName: 'departamento',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      isSorted: query.sortBy === 'departamento',
      isSortedDescending: query.sortBy === 'departamento' ? query.isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text variant="medium">{usuario.departamento || '-'}</Text>
      ),
    },
    {
      key: 'fechaIngreso',
      name: 'Fecha Ingreso',
      fieldName: 'fechaIngreso',
      minWidth: 120,
      maxWidth: 140,
      isResizable: true,
      isSorted: query.sortBy === 'fechaingreso',
      isSortedDescending: query.sortBy === 'fechaingreso' ? query.isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text variant="medium">
          {usuario.fechaIngreso ? new Date(usuario.fechaIngreso).toLocaleDateString('es-ES') : '-'}
        </Text>
      ),
    },
    {
      key: 'estado',
      name: 'Estado',
      fieldName: 'estado',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: query.sortBy === 'estado',
      isSortedDescending: query.sortBy === 'estado' ? query.isDescending : false,
      onRender: renderEstado,
    },
  ];

  // Handlers de filtros
  const handleFilterChange = (filterKey: string, value: string | undefined) => {
    applyFilters({ [filterKey]: value || '' });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRefresh = () => {
    refresh();
  };

  // Renderizado principal
  return (
    <Stack styles={containerStyles}>
      {/* Header */}
      <Stack styles={headerStyles}>
        <Stack>
          <Text styles={titleStyles}>Gestión de Usuarios</Text>
          <Text styles={subtitleStyles}>
            Administra usuarios, roles y permisos del sistema
          </Text>
        </Stack>
      </Stack>

      {/* Estadísticas */}
      <Stack horizontal styles={statsGridStyles} tokens={{ childrenGap: 16 }}>
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{estadisticas.totalUsuarios}</Text>
          <Text styles={statLabelStyles}>Total Usuarios</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{estadisticas.usuariosActivos}</Text>
          <Text styles={statLabelStyles}>Activos</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{estadisticas.usuariosInactivos}</Text>
          <Text styles={statLabelStyles}>Inactivos</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{estadisticas.usuariosAdmins}</Text>
          <Text styles={statLabelStyles}>Administradores</Text>
        </Stack>
      </Stack>

      {/* Botón Nuevo Usuario */}
      <Stack horizontalAlign="start" tokens={{ padding: '16px 0' }}>
        <PrimaryButton
          text="Nuevo Usuario"
          iconProps={{ iconName: 'AddFriend' }}
          onClick={openCreateModal}
          styles={actionButtonStyles}
          disabled={isLoading}
        />
      </Stack>

      {/* Filtros */}
      <Stack styles={filtersContainerStyles}>
        <Stack horizontal styles={filterRowStyles} tokens={{ childrenGap: 12 }}>
          <Stack styles={filterItemStyles}>
            <Dropdown
              label="Departamento"
              placeholder="Seleccionar departamento"
              options={departamentosOptions}
              selectedKey={query.departamentoId || ''}
              onChange={(_, option) => handleFilterChange('departamentoId', option?.key as string)}
              disabled={isDropdownsLoading}
            />
          </Stack>
          
          <Stack styles={filterItemStyles}>
            <Dropdown
              label="Rol"
              placeholder="Seleccionar rol"
              options={rolesOptions}
              selectedKey={query.rol || ''}
              onChange={(_, option) => handleFilterChange('rol', option?.key as string)}
              disabled={isDropdownsLoading}
            />
          </Stack>
          
          <Stack styles={filterItemStyles}>
            <Dropdown
              label="Estado"
              placeholder="Seleccionar estado"
              options={estadosOptions}
              selectedKey={
                query.estaActivo === undefined ? '' : 
                query.estaActivo ? 'Activo' : 'Inactivo'
              }
              onChange={(_, option) => {
                if (option?.key === '') {
                  applyFilters({ estaActivo: undefined });
                } else if (option?.key === 'Activo') {
                  applyFilters({ estaActivo: true });
                } else if (option?.key === 'Inactivo') {
                  applyFilters({ estaActivo: false });
                }
              }}
            />
          </Stack>
          
          <Stack verticalAlign="end">
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <DefaultButton
                text="Limpiar Filtros"
                iconProps={{ iconName: 'ClearFilter' }}
                onClick={handleClearFilters}
                disabled={isLoading}
              />
              <DefaultButton
                text="Actualizar"
                iconProps={{ iconName: isLoading ? 'ProgressRingDots' : 'Refresh' }}
                onClick={handleRefresh}
                disabled={isLoading}
                title="Actualizar lista de usuarios"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Tabla */}
      <Stack styles={tableContainerStyles}>
        {isLoading ? (
          <Stack styles={loadingContainerStyles}>
            <Spinner 
              size={SpinnerSize.large} 
              label="Cargando usuarios..." 
              ariaLive="assertive" 
            />
          </Stack>
        ) : usuarios.length === 0 ? (
          <Stack styles={emptyStateStyles}>
            <Icon iconName="People" styles={emptyStateIconStyles} />
            <Text styles={emptyStateTitleStyles}>No hay usuarios</Text>
            <Text styles={emptyStateMessageStyles}>
              No se encontraron usuarios que coincidan con los filtros aplicados. 
              Intenta ajustar los criterios de búsqueda o crear un nuevo usuario.
            </Text>
            <PrimaryButton
              text="Crear Primer Usuario"
              iconProps={{ iconName: 'AddFriend' }}
              onClick={openCreateModal}
              styles={{ root: { marginTop: '16px' } }}
            />
          </Stack>
        ) : (
          <DataTable<UsuarioAdmin>
            items={usuarios}
            columns={columns}
            isLoading={isLoading}
            onSort={changeSorting}
            pagination={{
              currentPage,
              totalItems: totalCount,
              pageSize,
              onPageChange: changePage,
              onPageSizeChange: changePageSize,
              pageSizeOptions: [10, 25, 50, 100],
            }}
          />
        )}
      </Stack>

      {/* Loading overlay para operaciones */}
      {(isOperationLoading || isUserLoading) && (
        <Dialog
          hidden={false}
          modalProps={{
            isBlocking: true,
            isDarkOverlay: true,
          }}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Procesando...',
            showCloseButton: false,
          }}
        >
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Spinner size={SpinnerSize.large} />
            <Text>Procesando operación, por favor espere...</Text>
          </Stack>
        </Dialog>
      )}

      {/* Modal Nuevo Usuario */}
      <NuevoUsuarioModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
        departamentos={departamentos}
        roles={roles}
        jefes={jefes}
        dropdownsLoading={isDropdownsLoading}
        mode={modal.mode}
        usuarioId={modal.selectedUserId || undefined}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={hideSnackbar}
        position="top"
      />

      {/* Modal de confirmación para toggle status */}
      <ConfirmarToggleStatusModal
        isOpen={toggleStatusModal.isOpen}
        onClose={closeToggleStatusModal}
        onConfirm={confirmToggleStatus}
        usuario={toggleStatusModal.selectedUsuario}
        isLoading={isTogglingUserStatus}
        error={toggleUserStatusError}
      />

      {/* Modal para reiniciar contraseña */}
      <ReiniciarPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={closeResetPasswordModal}
        onConfirm={confirmResetPassword}
        usuario={resetPasswordModal.selectedUsuario}
        isLoading={isResettingPassword}
        error={resetPasswordError}
        contrasenaTemporal={resetPasswordModal.contrasenaTemporal}
      />
    </Stack>
  );
};

export default GestionUsuarios;
