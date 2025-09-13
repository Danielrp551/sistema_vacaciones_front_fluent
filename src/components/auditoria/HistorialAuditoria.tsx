import React, { useState } from 'react';
import {
  Stack,
  Text,
  IconButton,
  TooltipHost,
  Callout,
  DirectionalHint,
  PersonaSize,
  Persona,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { DataTable, type DataTableColumn } from '../DataTable/DataTable';
import { useAuditoria } from '../../hooks/auditoria';
import auditoriaService from '../../services/auditoria.service';
import { SEVERIDAD_CONFIG, PAGINACION_DEFAULT } from '../../utils/auditoria.constants';
import type { AuditoriaSimple, ModuloSistemaType } from '../../types/auditoria';

// ============================================================================
// INTERFACES
// ============================================================================

export interface HistorialAuditoriaProps {
  /**
   * Módulo del sistema para filtrar el historial
   */
  modulo?: ModuloSistemaType;
  
  /**
   * Tabla afectada para filtrar el historial (opcional)
   * Por ejemplo: "AspNetUsers", "AspNetRoles", "SolicitudesVacaciones", etc.
   */
  tablaAfectada?: string;
  
  /**
   * ID del registro/usuario para filtrar el historial (opcional)
   * El significado depende del módulo (usuarioId, solicitudId, etc.)
   */
  filtroId?: string;
  
  /**
   * Título personalizado para el componente
   */
  titulo?: string;
  
  /**
   * Mostrar filtros adicionales
   */
  mostrarFiltros?: boolean;
  
  /**
   * Tamaño de página inicial
   */
  tamanoPagina?: number;
  
  /**
   * Callback cuando se selecciona un registro para ver detalles
   */
  onVerDetalle?: (registro: AuditoriaSimple) => void;
  
  /**
   * Mensajes personalizados para estado vacío
   */
  mensajesVacios?: {
    titulo: string;
    mensaje: string;
  };
}

interface DetalleCalloutState {
  isVisible: boolean;
  target: HTMLElement | null;
  registro: AuditoriaSimple | null;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const HistorialAuditoria: React.FC<HistorialAuditoriaProps> = ({
  modulo,
  tablaAfectada,
  filtroId,
  titulo = 'Historial de Auditoría',
  tamanoPagina = 10,
  onVerDetalle,
  mensajesVacios
}) => {
  
  // ===== HOOKS =====
  const {
    registros,
    totalRegistros,
    paginaActual,
    isLoading,
    error,
    irAPagina,
    recargar,
    limpiarError,
    aplicarFiltros,
    filtrosActuales
  } = useAuditoria({
    modulo,
    usuarioId: filtroId, // Por compatibilidad con el hook actual
    tamanoPaginaInicial: tamanoPagina,
    cargarAutomaticamente: true,
    filtrosIniciales: {
      tablaAfectada
    }
  });

  // ===== ESTADO LOCAL =====
  const [detalleCallout, setDetalleCallout] = useState<DetalleCalloutState>({
    isVisible: false,
    target: null,
    registro: null
  });

  // ===== FUNCIONES =====

  const cambiarTamanoPagina = async (nuevoTamano: number) => {
    await aplicarFiltros({
      tamanoPagina: nuevoTamano,
      pagina: 1 // Resetear a la primera página cuando se cambia el tamaño
    });
  };

  const mostrarDetalle = (registro: AuditoriaSimple, target: HTMLElement) => {
    setDetalleCallout({
      isVisible: true,
      target,
      registro
    });
  };

  const cerrarDetalle = () => {
    setDetalleCallout({
      isVisible: false,
      target: null,
      registro: null
    });
  };

  const manejarVerDetalle = (registro: AuditoriaSimple) => {
    if (onVerDetalle) {
      onVerDetalle(registro);
    }
  };

  // ===== RENDERIZADO DE COLUMNAS =====

  const renderFecha = (registro: AuditoriaSimple): React.ReactNode => {
    const fecha = auditoriaService.formatearFecha(registro.fechaHora);
    return (
      <Text style={{ fontSize: '14px', color: '#323130' }}>
        {fecha}
      </Text>
    );
  };

  const renderAccion = (registro: AuditoriaSimple): React.ReactNode => {
    return (
      <Stack>
        <Text style={{ fontSize: '14px', fontWeight: '600', color: '#323130' }}>
          {registro.mensajeCorto}
        </Text>
        {registro.motivo && (
          <Text style={{ fontSize: '12px', color: '#605e5c', fontStyle: 'italic' }}>
            {registro.motivo}
          </Text>
        )}
      </Stack>
    );
  };

  const renderUsuario = (registro: AuditoriaSimple): React.ReactNode => {
    return (
      <Persona
        key={`usuario-${registro.id}`}
        text={registro.usuarioEjecutor}
        secondaryText={registro.usuarioAfectado || undefined}
        size={PersonaSize.size32}
        styles={{
          root: { cursor: 'default' },
          primaryText: { fontSize: '14px', fontWeight: '500' },
          secondaryText: { fontSize: '12px', color: '#605e5c' }
        }}
      />
    );
  };

  const renderSeveridad = (registro: AuditoriaSimple): React.ReactNode => {
    const config = SEVERIDAD_CONFIG[registro.severidad as keyof typeof SEVERIDAD_CONFIG];
    
    if (!config) {
      return (
        <Text key={`severidad-${registro.id}`} style={{ fontSize: '12px', color: '#605e5c' }}>
          {registro.severidad}
        </Text>
      );
    }

    return (
      <span
        key={`severidad-badge-${registro.id}`}
        style={{
          backgroundColor: config.bgColor.replace('bg-', '').replace('-50', '#f3f4f6').replace('-100', '#e5e7eb'),
          color: config.textColor.replace('text-', '').replace('-700', '#374151').replace('-800', '#1f2937'),
          border: `1px solid ${config.borderColor.replace('border-', '').replace('-200', '#d1d5db').replace('-300', '#9ca3af')}`,
          fontWeight: '600',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        {config.descripcion}
      </span>
    );
  };

  const renderIP = (registro: AuditoriaSimple): React.ReactNode => {
    return (
      <Text style={{ fontSize: '12px', color: '#605e5c', fontFamily: 'monospace' }}>
        {registro.ipAddress}
      </Text>
    );
  };

  const renderAcciones = (registro: AuditoriaSimple): React.ReactNode => {
    return (
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <TooltipHost content="Ver detalle rápido">
          <IconButton
            iconProps={{ iconName: 'Info' }}
            onClick={(e) => {
              e.stopPropagation();
              mostrarDetalle(registro, e.currentTarget as HTMLElement);
            }}
            styles={{
              root: {
                backgroundColor: '#f3f2f1',
                borderRadius: '4px',
                height: '32px',
                width: '32px'
              },
              rootHovered: {
                backgroundColor: '#e1dfdd'
              }
            }}
          />
        </TooltipHost>
        
        {onVerDetalle && (
          <TooltipHost content="Ver detalle completo">
            <IconButton
              iconProps={{ iconName: 'OpenInNewWindow' }}
              onClick={(e) => {
                e.stopPropagation();
                manejarVerDetalle(registro);
              }}
              styles={{
                root: {
                  backgroundColor: '#f3f2f1',
                  borderRadius: '4px',
                  height: '32px',
                  width: '32px'
                },
                rootHovered: {
                  backgroundColor: '#e1dfdd'
                }
              }}
            />
          </TooltipHost>
        )}
      </Stack>
    );
  };

  // ===== DEFINICIÓN DE COLUMNAS =====
  const columns: DataTableColumn<AuditoriaSimple>[] = [
    {
      key: 'fechaHora',
      name: 'Fecha y Hora',
      fieldName: 'fechaHora',
      minWidth: 140,
      maxWidth: 160,
      isResizable: true,
      isSortable: true,
      onRender: renderFecha
    },
    {
      key: 'accion',
      name: 'Acción',
      fieldName: 'mensajeCorto',
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      isSortable: true,
      onRender: renderAccion
    },
    {
      key: 'usuario',
      name: 'Usuario',
      fieldName: 'usuarioEjecutor',
      minWidth: 180,
      maxWidth: 250,
      isResizable: true,
      isSortable: true,
      onRender: renderUsuario
    },
    {
      key: 'severidad',
      name: 'Severidad',
      fieldName: 'severidad',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSortable: true,
      onRender: renderSeveridad
    },
    {
      key: 'ip',
      name: 'IP',
      fieldName: 'ipAddress',
      minWidth: 120,
      maxWidth: 140,
      isResizable: true,
      isSortable: false,
      onRender: renderIP
    },
    {
      key: 'acciones',
      name: 'Acciones',
      fieldName: '',
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      isSortable: false,
      onRender: renderAcciones
    }
  ];

  // ===== RENDERIZADO =====
  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack>
          <Text variant="xLarge" style={{ fontWeight: '600' }}>
            {titulo}
          </Text>
          {totalRegistros > 0 && (
            <Text variant="medium" style={{ color: '#605e5c' }}>
              {totalRegistros} registro{totalRegistros !== 1 ? 's' : ''} encontrado{totalRegistros !== 1 ? 's' : ''}
            </Text>
          )}
        </Stack>
        
        <TooltipHost content="Recargar datos">
          <IconButton
            iconProps={{ iconName: 'Refresh' }}
            onClick={recargar}
            disabled={isLoading}
            styles={{
              root: {
                backgroundColor: '#0078d4',
                color: 'white',
                borderRadius: '4px',
                height: '36px',
                width: '36px'
              },
              rootHovered: {
                backgroundColor: '#106ebe'
              },
              rootDisabled: {
                backgroundColor: '#f3f2f1',
                color: '#a19f9d'
              }
            }}
          />
        </TooltipHost>
      </Stack>

      {/* Error Message */}
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={limpiarError}
          dismissButtonAriaLabel="Cerrar"
        >
          {error}
        </MessageBar>
      )}

      {/* Data Table */}
      <DataTable<AuditoriaSimple>
        items={registros}
        columns={columns}
        isLoading={isLoading}
        emptyStateTitle={mensajesVacios?.titulo || "No hay registros de auditoría"}
        emptyStateMessage={
          mensajesVacios?.mensaje || (
            filtroId 
              ? "No se encontraron registros para el filtro aplicado"
              : "No se encontraron registros de auditoría en el sistema"
          )
        }
        pagination={{
          currentPage: paginaActual,
          totalItems: totalRegistros,
          pageSize: filtrosActuales.tamanoPagina || tamanoPagina,
          pageSizeOptions: [...PAGINACION_DEFAULT.OPCIONES_TAMANO_PAGINA],
          onPageChange: irAPagina,
          onPageSizeChange: cambiarTamanoPagina,
          itemName: 'registros'
        }}
      />

      {/* Callout de Detalle Rápido */}
      {detalleCallout.isVisible && detalleCallout.target && detalleCallout.registro && (
        <Callout
          target={detalleCallout.target}
          onDismiss={cerrarDetalle}
          directionalHint={DirectionalHint.leftTopEdge}
          styles={{ 
            root: { padding: '16px', maxWidth: '400px' }
          }}
        >
          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="mediumPlus" style={{ fontWeight: '600' }}>
              Detalle de Auditoría
            </Text>
            
            <Stack tokens={{ childrenGap: 8 }}>
              <Stack>
                <Text style={{ fontWeight: '600', fontSize: '14px' }}>Acción:</Text>
                <Text style={{ fontSize: '14px' }}>{detalleCallout.registro.mensajeCorto}</Text>
              </Stack>
              
              <Stack>
                <Text style={{ fontWeight: '600', fontSize: '14px' }}>Usuario:</Text>
                <Text style={{ fontSize: '14px' }}>{detalleCallout.registro.usuarioEjecutor}</Text>
              </Stack>
              
              {detalleCallout.registro.usuarioAfectado && (
                <Stack>
                  <Text style={{ fontWeight: '600', fontSize: '14px' }}>Usuario Afectado:</Text>
                  <Text style={{ fontSize: '14px' }}>{detalleCallout.registro.usuarioAfectado}</Text>
                </Stack>
              )}
              
              <Stack>
                <Text style={{ fontWeight: '600', fontSize: '14px' }}>Fecha:</Text>
                <Text style={{ fontSize: '14px' }}>
                  {auditoriaService.formatearFecha(detalleCallout.registro.fechaHora)}
                </Text>
              </Stack>
              
              {detalleCallout.registro.motivo && (
                <Stack>
                  <Text style={{ fontWeight: '600', fontSize: '14px' }}>Motivo:</Text>
                  <Text style={{ fontSize: '14px' }}>{detalleCallout.registro.motivo}</Text>
                </Stack>
              )}
              
              <Stack>
                <Text style={{ fontWeight: '600', fontSize: '14px' }}>IP Address:</Text>
                <Text style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                  {detalleCallout.registro.ipAddress}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Callout>
      )}
    </Stack>
  );
};
