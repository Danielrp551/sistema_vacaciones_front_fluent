import React from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import type { IColumn } from '@fluentui/react';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination';
import './DataTable.css';

export interface DataTableColumn<T = any> extends Omit<IColumn, 'onRender'> {
  onRender?: (item: T, index?: number, column?: IColumn) => React.ReactNode;
  isSortable?: boolean; // Nueva propiedad opcional - por defecto true
}

export interface DataTableProps<T = any> {
  // Datos y configuración
  items: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyStateMessage?: string;
  emptyStateTitle?: string;
  
  // Paginación
  pagination?: PaginationProps;
  
  // Configuración de la tabla
  selectionMode?: SelectionMode;
  layoutMode?: DetailsListLayoutMode;
  className?: string;
  
  // Callbacks
  onItemClick?: (item: T, index?: number) => void;
  onSort?: (columnKey: string, isSortedDescending?: boolean) => void;
  
  // Estilos personalizados
  tableContainerStyles?: React.CSSProperties;
  emptyStateStyles?: React.CSSProperties;
}

export const DataTable = <T extends Record<string, any>>({
  items,
  columns,
  isLoading = false,
  emptyStateMessage = 'No hay elementos para mostrar',
  emptyStateTitle = 'Lista vacía',
  pagination,
  selectionMode = SelectionMode.none,
  layoutMode = DetailsListLayoutMode.justified,
  className,
  onItemClick,
  onSort,
  tableContainerStyles,
  emptyStateStyles,
}: DataTableProps<T>) => {
  // Configurar las columnas con manejo de ordenamiento
  const configuredColumns: IColumn[] = columns.map(col => ({
    ...col,
    onColumnClick: onSort && col.key !== 'acciones' && col.isSortable !== false ? () => {
      const isSortedDescending = col.isSorted && !col.isSortedDescending;
      onSort(col.key, isSortedDescending);
    } : undefined,
  }));

  const defaultTableStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    overflow: 'hidden',
    minHeight: '200px',
    width: '100%',
    ...tableContainerStyles,
  };

  const defaultEmptyStateStyles: React.CSSProperties = {
    minHeight: '200px',
    backgroundColor: '#faf9f8',
    padding: '40px 20px',
    ...emptyStateStyles,
  };

  return (
    <Stack className={className}>
      {/* Contenedor de la tabla */}
      <Stack style={defaultTableStyles}>
        {isLoading ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            styles={{
              root: {
                minHeight: '200px',
                backgroundColor: '#faf9f8',
              },
            }}
          >
            <Spinner size={SpinnerSize.large} label="Cargando datos..." />
          </Stack>
        ) : items.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ childrenGap: 16 }}
            style={defaultEmptyStateStyles}
          >
            <Text
              styles={{
                root: {
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#a19f9d',
                  marginBottom: '8px',
                },
              }}
            >
              📋
            </Text>
            <Text
              styles={{
                root: {
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#323130',
                  marginBottom: '8px',
                },
              }}
            >
              {emptyStateTitle}
            </Text>
            <Text
              styles={{
                root: {
                  fontSize: '14px',
                  color: '#605e5c',
                  textAlign: 'center',
                  maxWidth: '400px',
                },
              }}
            >
              {emptyStateMessage}
            </Text>
          </Stack>
        ) : (
          <div style={{ width: '100%' }} className="custom-datatable">
            <DetailsList
              items={items}
              columns={configuredColumns}
              layoutMode={layoutMode}
              selectionMode={selectionMode}
              onItemInvoked={onItemClick}
              setKey="dataTable"
              onShouldVirtualize={() => false}
              className="custom-details-list"
              styles={{
                headerWrapper: {
                  backgroundColor: 'rgb(229, 233, 242)',
                },
                root: {
                  selectors: {
                    '.ms-DetailsHeader': {
                      backgroundColor: 'rgb(229, 233, 242) !important',
                    },
                    '.ms-DetailsHeader-cell': {
                      backgroundColor: 'rgb(229, 233, 242) !important',
                    },
                    '.ms-DetailsHeader-cellTitle': {
                      backgroundColor: 'rgb(229, 233, 242) !important',
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </Stack>

      {/* Paginación */}
      {pagination && pagination.totalItems > 0 && (
        <Pagination {...pagination} />
      )}
    </Stack>
  );
};
