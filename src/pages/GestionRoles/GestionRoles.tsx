// ============================================================================
// PÁGINA DE GESTIÓN DE ROLES
// ============================================================================
// Página principal para administrar roles del sistema con interfaz completa
// de CRUD, filtros, paginación y auditoría usando Fluent UI
// ============================================================================

import React, { useState } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
  Icon,
  IconButton,
  TooltipHost,
  ContextualMenuItemType,
  Pivot,
  PivotItem,
  SearchBox,
  MessageBar,
  MessageBarType,
  SelectionMode,
} from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn } from '../../components/DataTable';
import { HistorialAuditoria } from '../../components/auditoria';
import { Snackbar } from '../../components/Common/Snackbar';
import { RolModal } from '../../components/GestionRoles';
import { EstadoRolModal } from '../../components/GestionRoles/EstadoRolModal/EstadoRolModal';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useGestionRolesController } from './GestionRoles.controller';
import type { RolAdmin } from '../../types/roles';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
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
  roleBadgeStyles,
  permisoChipStyles,
  permisosContainerStyles,
  auditTabStyles,
} from './GestionRoles.styles';

const GestionRoles: React.FC = () => {
  // Hook para Snackbar
  const { snackbar, hideSnackbar } = useSnackbar();

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<string>('roles');

  const {
    // Estado de datos
    roles,
    totalCount,
    currentPage,
    pageSize,
    query,
    permisos,
    
    // Estado de UI
    isLoading,
    modal,
    notification,
    
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
  } = useGestionRolesController();

  // Configuración de columnas para la tabla
  const columns: DataTableColumn<RolAdmin>[] = [
    {
      key: 'acciones',
      name: 'Acciones',
      fieldName: '',
      minWidth: 60,
      maxWidth: 60,
      isResizable: false,
      isSortable: false,
      onRender: (item: RolAdmin) => {
        const isActive = item.estado?.toLowerCase() === 'activo';
        const menuItems: IContextualMenuItem[] = [
          {
            key: 'view',
            text: 'Ver detalles',
            iconProps: { iconName: 'View' },
            onClick: () => openViewModal(item.id),
          },
          {
            key: 'edit',
            text: 'Editar',
            iconProps: { iconName: 'Edit' },
            onClick: () => openEditModal(item.id),
          },
          {
            key: 'divider',
            itemType: ContextualMenuItemType.Divider,
          },
          {
            key: 'estado',
            text: isActive ? 'Desactivar' : 'Activar',
            iconProps: { iconName: isActive ? 'StatusCircleErrorX' : 'StatusCircleCheckmark' },
            onClick: () => openEstadoModal(item),
          },
        ];

        return (
          <TooltipHost content="Acciones">
            <IconButton
              iconProps={{ iconName: 'MoreVertical' }}
              menuIconProps={{ iconName: '' }}
              menuProps={{ 
                items: menuItems,
                directionalHint: 6 // DirectionalHint.rightTopEdge
              }}
              ariaLabel="Menú de acciones"
              styles={{
                root: {
                  height: '32px',
                  width: '32px',
                },
                menuIcon: {
                  fontSize: '16px',
                }
              }}
            />
          </TooltipHost>
        );
      },
    },
    {
      key: 'name',
      name: 'Rol',
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      isSorted: query.sortBy === 'name',
      isSortedDescending: query.isDescending,
      onColumnClick: () => changeSorting('name'),
      onRender: (item: RolAdmin) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Icon iconName="SecurityGroup" style={{ color: '#106ebe', fontSize: '16px' }} />
          <Text variant="medium" style={{ fontWeight: '500' }}>
            {item.name}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'descripcion',
      name: 'Descripción',
      fieldName: 'descripcion',
      minWidth: 150,
      maxWidth: 230,
      isResizable: true,
      isMultiline: true,
      isSortable: false,
      onRender: (item: RolAdmin) => (
        <Text variant="small" style={{ color: '#605e5c' }}>
          {item.descripcion}
        </Text>
      ),
    },
    {
      key: 'permisos',
      name: 'Permisos',
      fieldName: 'permisos',
      minWidth: 300,
      maxWidth: 400,
      isResizable: true,
      isSortable: false,
      onRender: (item: RolAdmin) => (
        <Stack styles={permisosContainerStyles}>
          {item.permisos.slice(0, 3).map((permiso) => (
            <Stack key={permiso.id} styles={permisoChipStyles}>
              <Text variant="small">{permiso.nombreRuta}</Text>
            </Stack>
          ))}
          {item.permisos.length > 3 && (
            <Stack styles={permisoChipStyles}>
              <Text variant="small">+{item.permisos.length - 3} más</Text>
            </Stack>
          )}
        </Stack>
      ),
    },
    {
      key: 'usuariosCount',
      name: 'Usuarios',
      fieldName: 'usuariosCount',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: query.sortBy === 'usuarios',
      isSortedDescending: query.isDescending,
      onRender: (item: RolAdmin) => (
        <Stack styles={roleBadgeStyles}>
          <Text variant="small">{item.numeroPersonas || 0}</Text>
        </Stack>
      ),
    },
  ];

  // Renderizado del contenido principal de roles
  const renderRolesContent = () => {
    if (isLoading) {
      return (
        <Stack styles={loadingContainerStyles}>
          <Spinner size={SpinnerSize.large} label="Cargando roles..." />
        </Stack>
      );
    }

    if (roles.length === 0) {
      return (
        <Stack styles={emptyStateStyles}>
          <Icon iconName="SecurityGroup" styles={emptyStateIconStyles} />
          <Text styles={emptyStateTitleStyles}>No hay roles registrados</Text>
          <Text styles={emptyStateMessageStyles}>
            Comience creando el primer rol del sistema
          </Text>
          <PrimaryButton
            text="Crear Primer Rol"
            iconProps={{ iconName: 'Add' }}
            onClick={openCreateModal}
            styles={{ root: { marginTop: '16px' } }}
          />
        </Stack>
      );
    }

    return (
      <DataTable
        items={roles}
        columns={columns}
        onSort={changeSorting}
        pagination={{
          currentPage,
          pageSize,
          totalItems: totalCount,
          onPageChange: changePage,
          onPageSizeChange: changePageSize,
          itemName: 'roles'
        }}
        isLoading={isLoading}
        selectionMode={SelectionMode.none}
      />
    );
  };

  // Cálculo de estadísticas
  const totalPermisos = permisos.length;
  const rolesActivos = roles.filter(rol => rol.numeroPersonas && rol.numeroPersonas > 0).length;

  return (
    <Stack styles={containerStyles}>
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" styles={headerStyles}>
        <Stack>
          <Text styles={titleStyles}>Gestión de Roles</Text>
          <Text styles={subtitleStyles}>
            Administre los roles del sistema
          </Text>
        </Stack>
      </Stack>

      {/* Pestañas */}
      <Pivot
        selectedKey={activeTab}
        onLinkClick={(item) => setActiveTab(item?.props.itemKey || 'roles')}
        headersOnly
        getTabId={(itemKey) => `tab-${itemKey}`}
      >
        <PivotItem headerText="Roles" itemKey="roles" itemIcon="SecurityGroup" />
        <PivotItem headerText="Auditoría" itemKey="auditoria" itemIcon="History" />
      </Pivot>

      {/* Contenido de las pestañas */}
      {activeTab === 'roles' && (
        <>
          {/* Estadísticas */}
          <Stack horizontal tokens={{ childrenGap: 16 }} styles={statsGridStyles}>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{totalCount}</Text>
              <Text styles={statLabelStyles}>Total Roles</Text>
            </Stack>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{rolesActivos}</Text>
              <Text styles={statLabelStyles}>Roles Activos</Text>
            </Stack>
            <Stack styles={statCardStyles}>
              <Text styles={statNumberStyles}>{totalPermisos}</Text>
              <Text styles={statLabelStyles}>Permisos Disponibles</Text>
            </Stack>
          </Stack>

          {/* Botones de acción */}
          <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginBottom: '16px' } }}>
            <DefaultButton
              text="Actualizar"
              iconProps={{ iconName: 'Refresh' }}
              onClick={refreshRoles}
              disabled={isLoading}
              styles={{
                root: {
                  minWidth: '100px',
                  height: '32px',
                },
                icon: {
                  fontSize: '14px',
                }
              }}
            />
            <PrimaryButton
              text="Nuevo Rol"
              iconProps={{ iconName: 'Add' }}
              onClick={openCreateModal}
              styles={{
                root: {
                  minWidth: '120px',
                  height: '32px',
                },
                icon: {
                  fontSize: '14px',
                }
              }}
            />
          </Stack>

          {/* Filtros */}
          <Stack styles={filtersContainerStyles}>
            <Stack horizontal wrap tokens={{ childrenGap: 16 }} styles={filterRowStyles}>
              <Stack styles={filterItemStyles}>
                <SearchBox
                  placeholder="Buscar por nombre..."
                  value={query.name || ''}
                  onChange={(_, newValue) => applyFilters({ name: newValue })}
                  onClear={() => applyFilters({ name: undefined })}
                />
              </Stack>
              <Stack styles={filterItemStyles}>
                <DefaultButton
                  text="Limpiar Filtros"
                  iconProps={{ iconName: 'ClearFilter' }}
                  onClick={clearFilters}
                  disabled={!query.name}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Tabla de roles */}
          <Stack styles={tableContainerStyles}>
            {renderRolesContent()}
          </Stack>
        </>
      )}

      {/* Tab de Auditoría */}
      {activeTab === 'auditoria' && (
        <Stack styles={auditTabStyles}>
          <HistorialAuditoria 
            modulo="GESTION_ROLES"
            tablaAfectada="AspNetRoles"
            titulo="Auditoría de Gestión de Roles"
            mensajesVacios={{
              titulo: "No hay registros de auditoría",
              mensaje: "No se encontraron acciones realizadas en la gestión de roles"
            }}
          />
        </Stack>
      )}

      {/* Modal de Rol (Crear/Editar/Ver) */}
      <RolModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        rolId={modal.selectedRolId || undefined}
        onClose={closeModal}
        onSuccess={() => {
          refreshRoles();
          closeModal();
        }}
      />

      {/* Modal de cambio de estado */}
      <EstadoRolModal
        isOpen={estadoModal.isOpen}
        rol={estadoModal.selectedRol}
        onClose={closeEstadoModal}
        onSuccess={() => {
          refreshRoles();
          closeEstadoModal();
        }}
      />

      {/* Notificaciones */}
      {notification.show && (
        <MessageBar
          messageBarType={
            notification.type === 'success' ? MessageBarType.success :
            notification.type === 'error' ? MessageBarType.error :
            notification.type === 'warning' ? MessageBarType.warning :
            MessageBarType.info
          }
          onDismiss={closeNotification}
          dismissButtonAriaLabel="Cerrar"
          styles={{
            root: {
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              maxWidth: '400px',
            }
          }}
        >
          {notification.message}
        </MessageBar>
      )}

      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={hideSnackbar}
      />
    </Stack>
  );
};

export default GestionRoles;
