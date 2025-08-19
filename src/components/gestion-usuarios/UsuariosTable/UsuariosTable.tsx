import React from 'react';
import {
  Stack,
  Text,
  IconButton,
  TooltipHost,
  Persona,
  PersonaSize,
} from '@fluentui/react';
import { DataTable, type DataTableColumn } from '../../DataTable/DataTable';
import type { UsuarioAdmin } from '../../../types/usuarios';
import './UsuariosTable.css';

interface UsuariosTableProps {
  usuarios: UsuarioAdmin[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (usuario: UsuarioAdmin) => void;
  onToggleActive: (usuario: UsuarioAdmin) => void;
  onSort?: (sortBy: string, isDescending?: boolean) => void;
  sortBy?: string;
  isDescending?: boolean;
}

export const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  isLoading,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onToggleActive,
  onSort,
  sortBy,
  isDescending,
}) => {
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return '-';
    }
  };

  const renderPersona = (usuario: UsuarioAdmin): React.ReactNode => {
    return (
      <Persona
        text={usuario.nombreCompleto}
        secondaryText={usuario.email}
        size={PersonaSize.size32}
        imageAlt={usuario.nombreCompleto}
        styles={{
          root: { cursor: 'pointer' },
          primaryText: { fontSize: '14px', fontWeight: '600' },
          secondaryText: { fontSize: '12px', color: '#605e5c' }
        }}
      />
    );
  };

  const renderEstado = (usuario: UsuarioAdmin): React.ReactNode => {
    const isActive = usuario.estado === 'Activo';
    return (
      <span
        style={{
          backgroundColor: isActive ? '#e7f5e7' : '#fdf2f2',
          color: isActive ? '#0f7b0f' : '#d13438',
          border: `1px solid ${isActive ? '#0f7b0f' : '#d13438'}`,
          fontWeight: '600',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        {usuario.estado}
      </span>
    );
  };

  const renderActions = (usuario: UsuarioAdmin): React.ReactNode => {
    return (
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <TooltipHost content="Editar usuario">
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(usuario);
            }}
            styles={{
              root: {
                color: '#0078d4',
                ':hover': {
                  backgroundColor: '#f3f2f1',
                  color: '#106ebe',
                }
              }
            }}
          />
        </TooltipHost>

        <TooltipHost content={usuario.estado === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'}>
          <IconButton
            iconProps={{ iconName: usuario.estado === 'Activo' ? 'UserRemove' : 'UserFollowed' }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(usuario);
            }}
            styles={{
              root: {
                color: usuario.estado === 'Activo' ? '#d13438' : '#107c10',
                ':hover': {
                  backgroundColor: '#f3f2f1',
                  color: usuario.estado === 'Activo' ? '#a4262c' : '#0b5394',
                }
              }
            }}
          />
        </TooltipHost>
      </Stack>
    );
  };

  const columns: DataTableColumn<UsuarioAdmin>[] = [
    {
      key: 'usuario',
      name: 'Usuario',
      fieldName: 'nombreCompleto',
      minWidth: 250,
      maxWidth: 300,
      isResizable: true,
      isSorted: sortBy === 'nombreCompleto',
      isSortedDescending: sortBy === 'nombreCompleto' ? isDescending : false,
      onRender: renderPersona,
    },
    {
      key: 'dni',
      name: 'DNI',
      fieldName: 'dni',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: sortBy === 'dni',
      isSortedDescending: sortBy === 'dni' ? isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text styles={{ root: { fontSize: '14px' } }}>
          {usuario.dni || '-'}
        </Text>
      ),
    },
    {
      key: 'rol',
      name: 'Rol',
      fieldName: 'rol',
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      isSorted: sortBy === 'rol',
      isSortedDescending: sortBy === 'rol' ? isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text styles={{ root: { fontSize: '14px', fontWeight: '600' } }}>
          {usuario.rol}
        </Text>
      ),
    },
    {
      key: 'departamento',
      name: 'Departamento',
      fieldName: 'departamento',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      isSorted: sortBy === 'departamento',
      isSortedDescending: sortBy === 'departamento' ? isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text styles={{ root: { fontSize: '14px' } }}>
          {usuario.departamento || '-'}
        </Text>
      ),
    },
    {
      key: 'fechaIngreso',
      name: 'Fecha Ingreso',
      fieldName: 'fechaIngreso',
      minWidth: 120,
      maxWidth: 140,
      isResizable: true,
      isSorted: sortBy === 'fechaIngreso',
      isSortedDescending: sortBy === 'fechaIngreso' ? isDescending : false,
      onRender: (usuario: UsuarioAdmin) => (
        <Text styles={{ root: { fontSize: '14px' } }}>
          {formatDate(usuario.fechaIngreso)}
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
      isSorted: sortBy === 'estado',
      isSortedDescending: sortBy === 'estado' ? isDescending : false,
      onRender: renderEstado,
    },
    {
      key: 'acciones',
      name: 'Acciones',
      minWidth: 140,
      maxWidth: 140,
      isResizable: false,
      onRender: renderActions,
    },
  ];

  return (
    <DataTable<UsuarioAdmin>
      items={usuarios}
      columns={columns}
      isLoading={isLoading}
      emptyStateTitle="No hay usuarios"
      emptyStateMessage="No se encontraron usuarios que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda."
      onSort={onSort}
      pagination={{
        currentPage,
        totalItems,
        pageSize,
        onPageChange,
        onPageSizeChange,
        pageSizeOptions: [10, 25, 50, 100],
      }}
      className="usuarios-table"
    />
  );
};
