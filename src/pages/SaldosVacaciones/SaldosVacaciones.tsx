import React from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Icon,
  CommandBarButton,
  ComboBox,
  Toggle,
} from '@fluentui/react';
import type { IDropdownOption, IComboBoxOption } from '@fluentui/react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn } from '../../components/DataTable';
import { useSaldosVacacionesController } from './SaldosVacaciones.controller';
import {
  containerStyles,
  headerStyles,
  titleStyles,
  subtitleStyles,
  filtersContainerStyles,
  statsGridStyles,
  statCardStyles,
  statNumberStyles,
  statLabelStyles,
  listContainerStyles,
  tableContainerStyles,
  loadingContainerStyles,
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateMessageStyles,
} from './SaldosVacaciones.styles';
import type { SaldoVacacionesDto } from '../../services/saldosVacaciones.service';

const SaldosVacaciones: React.FC = () => {
  const {
    saldos,
    totalCompleto,
    empleados,
    isLoading,
    error,
    successMessage,
    currentPage,
    pageSize,
    sortConfig,
    filters,
    stats,
    applyFilters,
    changePage,
    changePageSize,
    handleSort,
    clearError,
    clearSuccess,
    refreshData,
  } = useSaldosVacacionesController();

  // Opciones para filtros
  const periodoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos los períodos' },
    { key: '2024', text: '2024' },
    { key: '2025', text: '2025' },
    { key: '2026', text: '2026' },
  ];

  // Opciones para empleados - convertir a ComboBox options
  const empleadoOptions: IComboBoxOption[] = [
    { key: '', text: 'Todos los empleados' },
    ...empleados.map(emp => ({
      key: emp.id,
      text: `${emp.nombreCompleto} (${emp.email})`,
    }))
  ];

  // Formatear números con separadores de miles
  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES');
  };

  // Definir las columnas para el DataTable:
  // Id, Empleado, Periodo, Vencidas, Pendientes, Truncas, Días Libres, Días Bloque, Manager
  const columns: DataTableColumn<SaldoVacacionesDto>[] = [
    {
      key: 'id',
      name: 'ID',
      fieldName: 'id',
      minWidth: 60,
      maxWidth: 80,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'id',
      isSortedDescending: sortConfig?.key === 'id' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
          #{item.id}
        </Text>
      ),
    },
    {
      key: 'empleado',
      name: 'Empleado',
      fieldName: 'nombreEmpleado',
      minWidth: 150,
      maxWidth: 200,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'empleado',
      isSortedDescending: sortConfig?.key === 'empleado' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="medium" styles={{ root: { fontWeight: '500' } }}>
            {item.nombreEmpleado}
          </Text>
          <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
            {item.email}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'periodo',
      name: 'Período',
      fieldName: 'periodo',
      minWidth: 70,
      maxWidth: 90,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'periodo',
      isSortedDescending: sortConfig?.key === 'periodo' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ root: { fontWeight: '500' } }}>
          {item.periodo}
        </Text>
      ),
    },
    {
      key: 'diasVencidas',
      name: 'Vencidas',
      fieldName: 'diasVencidas',
      minWidth: 80,
      maxWidth: 100,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasVencidas',
      isSortedDescending: sortConfig?.key === 'diasVencidas' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ 
          root: { 
            fontWeight: '600', 
            textAlign: 'center', 
            color: item.diasVencidas > 0 ? '#d13438' : '#323130' 
          } 
        }}>
          {formatNumber(item.diasVencidas)}
        </Text>
      ),
    },
    {
      key: 'diasPendientes',
      name: 'Pendientes',
      fieldName: 'diasPendientes',
      minWidth: 80,
      maxWidth: 100,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasPendientes',
      isSortedDescending: sortConfig?.key === 'diasPendientes' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ 
          root: { 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#d83b01' 
          } 
        }}>
          {formatNumber(item.diasPendientes)}
        </Text>
      ),
    },
    {
      key: 'diasTruncas',
      name: 'Truncas',
      fieldName: 'diasTruncas',
      minWidth: 80,
      maxWidth: 100,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasTruncas',
      isSortedDescending: sortConfig?.key === 'diasTruncas' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ 
          root: { 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#8764b8' 
          } 
        }}>
          {formatNumber(item.diasTruncas)}
        </Text>
      ),
    },
    {
      key: 'diasLibres',
      name: 'Días Libres',
      fieldName: 'diasLibres',
      minWidth: 90,
      maxWidth: 110,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasLibres',
      isSortedDescending: sortConfig?.key === 'diasLibres' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ 
          root: { 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#107c10' 
          } 
        }}>
          {formatNumber(item.diasLibres)}
        </Text>
      ),
    },
    {
      key: 'diasBloque',
      name: 'Días Bloque',
      fieldName: 'diasBloque',
      minWidth: 90,
      maxWidth: 110,
      isResizable: false,
      data: 'number',
      isPadded: true,
      isSorted: sortConfig?.key === 'diasBloque',
      isSortedDescending: sortConfig?.key === 'diasBloque' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ 
          root: { 
            fontWeight: '600', 
            textAlign: 'center', 
            color: '#0078d4' 
          } 
        }}>
          {formatNumber(item.diasBloque)}
        </Text>
      ),
    },
    {
      key: 'managerSaldos',
      name: 'Manager',
      fieldName: 'nombreManager',
      minWidth: 120,
      maxWidth: 160,
      isResizable: false,
      data: 'string',
      isPadded: true,
      isSorted: sortConfig?.key === 'managerSaldos',
      isSortedDescending: sortConfig?.key === 'managerSaldos' && sortConfig?.direction === 'descending',
      onRender: (item: SaldoVacacionesDto) => (
        <Text variant="medium" styles={{ root: { color: '#605e5c' } }}>
          {item.nombreManager || 'Sin asignar'}
        </Text>
      ),
    },
  ];

  const handleFilterChange = (key: string, value: string | undefined) => {
    if (key === 'empleadoId') {
      applyFilters({ empleadoId: value || undefined });
    } else if (key === 'periodo') {
      applyFilters({ periodo: value ? parseInt(value) : undefined });
    } else if (key === 'incluirSubordinadosNivelN') {
      applyFilters({ incluirSubordinadosNivelN: value === 'true' });
    }
  };

  const clearFilters = () => {
    applyFilters({
      empleadoId: undefined,
      periodo: undefined,
      incluirSubordinadosNivelN: false,
    });
  };

  return (
    <Stack styles={containerStyles} tokens={{ childrenGap: 24 }}>
      {/* Header */}
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        wrap
        styles={headerStyles}
        tokens={{ childrenGap: 16 }}
      >
        <Stack tokens={{ childrenGap: 8 }}>
          <Text styles={titleStyles}>Saldos de Vacaciones</Text>
          <Text styles={subtitleStyles}>
            Consulta y administra los saldos de vacaciones del equipo
          </Text>
        </Stack>
      </Stack>

      {/* Mensajes de estado */}
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={clearError}
          dismissButtonAriaLabel="Cerrar"
        >
          {error}
        </MessageBar>
      )}

      {successMessage && (
        <MessageBar
          messageBarType={MessageBarType.success}
          onDismiss={clearSuccess}
          dismissButtonAriaLabel="Cerrar"
        >
          {successMessage}
        </MessageBar>
      )}

      {/* Tarjetas de estadísticas */}
      <Stack
        horizontal
        horizontalAlign="center"
        wrap
        tokens={{ childrenGap: 16 }}
        styles={statsGridStyles}
      >
        <Stack styles={statCardStyles}>
          <Text styles={statNumberStyles}>{formatNumber(stats.totalEmpleados)}</Text>
          <Text styles={statLabelStyles}>Empleados</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#d13438', margin: '0 0 4px 0' } }}>
            {formatNumber(stats.totalDiasVencidas)}
          </Text>
          <Text styles={statLabelStyles}>Días Vencidas</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#d83b01', margin: '0 0 4px 0' } }}>
            {formatNumber(stats.totalDiasPendientes)}
          </Text>
          <Text styles={statLabelStyles}>Días Pendientes</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#8764b8', margin: '0 0 4px 0' } }}>
            {formatNumber(stats.totalDiasTruncas)}
          </Text>
          <Text styles={statLabelStyles}>Días Truncas</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#107c10', margin: '0 0 4px 0' } }}>
            {formatNumber(stats.totalDiasLibres)}
          </Text>
          <Text styles={statLabelStyles}>Días Libres</Text>
        </Stack>
        <Stack styles={statCardStyles}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '600', color: '#0078d4', margin: '0 0 4px 0' } }}>
            {formatNumber(stats.totalDiasBloque)}
          </Text>
          <Text styles={statLabelStyles}>Días Bloque</Text>
        </Stack>
      </Stack>

      {/* Filtros */}
      <Stack styles={filtersContainerStyles} tokens={{ childrenGap: 16 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
          Filtros
        </Text>
        <Stack
          horizontal
          wrap
          tokens={{ childrenGap: 16 }}
          styles={{ 
            root: { 
              alignItems: 'end',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            } 
          }}
        >
          <Toggle
            label="Incluir subordinados de todos los niveles"
            checked={filters.incluirSubordinadosNivelN || false}
            onChange={(_, checked) => handleFilterChange('incluirSubordinadosNivelN', checked?.toString())}
            styles={{ root: { marginBottom: '8px' } }}
          />
          <ComboBox
            label="Empleado"
            placeholder="Buscar empleado..."
            allowFreeform
            autoComplete="on"
            options={empleadoOptions}
            selectedKey={filters.empleadoId || ''}
            onChange={(_, option) => handleFilterChange('empleadoId', option?.key as string)}
            styles={{ root: { minWidth: 200, width: '100%', maxWidth: 300 } }}
          />
          <Dropdown
            placeholder="Período"
            label="Período"
            options={periodoOptions}
            selectedKey={filters.periodo?.toString() || ''}
            onChange={(_, option) => handleFilterChange('periodo', option?.key as string)}
            styles={{ root: { minWidth: 150, width: '100%', maxWidth: 200 } }}
          />
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            iconProps={{ iconName: 'Clear' }}
            text="Limpiar filtros"
            onClick={clearFilters}
          />
          <CommandBarButton
            iconProps={{ iconName: 'Refresh' }}
            text="Actualizar"
            onClick={refreshData}
          />
        </Stack>
      </Stack>

      {/* Lista de saldos */}
      <Stack styles={listContainerStyles}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{
            root: {
              backgroundColor: '#faf9f8',
              borderBottom: '1px solid #edebe9',
              padding: '16px 20px',
            },
          }}
        >
          <Text variant="mediumPlus" styles={{ root: { fontWeight: '600' } }}>
            Saldos de Vacaciones ({totalCompleto})
          </Text>
        </Stack>

        {isLoading ? (
          <Stack styles={loadingContainerStyles}>
            <Spinner size={SpinnerSize.large} label="Cargando saldos de vacaciones..." />
          </Stack>
        ) : saldos.length === 0 ? (
          <Stack styles={emptyStateStyles}>
            <Icon iconName="ContactCard" style={emptyStateIconStyles} />
            <Text styles={emptyStateTitleStyles}>No hay saldos de vacaciones</Text>
            <Text styles={emptyStateMessageStyles}>
              No se encontraron saldos de vacaciones para mostrar con los filtros aplicados.
            </Text>
          </Stack>
        ) : (
          <Stack styles={tableContainerStyles}>
            <DataTable
              items={saldos}
              columns={columns}
              isLoading={isLoading}
              emptyStateTitle="No hay saldos de vacaciones"
              emptyStateMessage="No se encontraron saldos de vacaciones para mostrar"
              onSort={handleSort}
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalCompleto,
                pageSizeOptions: [5, 10, 25, 50],
                itemName: 'saldos',
                onPageChange: changePage,
                onPageSizeChange: changePageSize,
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default SaldosVacaciones;
