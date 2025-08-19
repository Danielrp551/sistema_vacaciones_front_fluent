import React from 'react';
import {
  Stack,
  Text,
  Icon,
  PersonaSize,
  Persona
} from '@fluentui/react';
import auditoriaService from '../../services/auditoria.service';
import { SEVERIDAD_CONFIG } from '../../utils/auditoria.constants';
import type { AuditoriaSimple } from '../../types/auditoria';

// ============================================================================
// INTERFACES
// ============================================================================

export interface RegistroAuditoriaCardProps {
  /**
   * Registro de auditoría a mostrar
   */
  registro: AuditoriaSimple;
  
  /**
   * Mostrar información completa o compacta
   */
  formato?: 'completo' | 'compacto';
  
  /**
   * Mostrar IP address
   */
  mostrarIP?: boolean;
  
  /**
   * Callback cuando se hace click en el registro
   */
  onClick?: (registro: AuditoriaSimple) => void;
  
  /**
   * Estilos personalizados
   */
  styles?: React.CSSProperties;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export const RegistroAuditoriaCard: React.FC<RegistroAuditoriaCardProps> = ({
  registro,
  formato = 'completo',
  mostrarIP = false,
  onClick,
  styles = {}
}) => {
  
  const getSeveridadColor = (severidad: string) => {
    const config = SEVERIDAD_CONFIG[severidad as keyof typeof SEVERIDAD_CONFIG];
    return config?.color || 'gray';
  };

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'CRITICAL': return 'ErrorBadge';
      case 'SECURITY': return 'Shield';
      case 'ERROR': return 'Error';
      case 'WARNING': return 'Warning';
      case 'INFO': return 'Info';
      default: return 'Info';
    }
  };

  const containerStyles: React.CSSProperties = {
    border: '1px solid #e1dfdd',
    borderRadius: '8px',
    padding: formato === 'compacto' ? '12px' : '16px',
    backgroundColor: '#fff',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...styles
  };

  const hoverStyles: React.CSSProperties = onClick ? {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderColor: '#0078d4'
  } : {};

  const handleClick = () => {
    if (onClick) {
      onClick(registro);
    }
  };

  if (formato === 'compacto') {
    return (
      <div
        style={containerStyles}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyles)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyles)}
        onClick={handleClick}
      >
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
          <Icon
            iconName={getSeveridadIcon(registro.severidad)}
            style={{
              color: getSeveridadColor(registro.severidad),
              fontSize: '16px'
            }}
          />
          
          <Stack grow>
            <Text style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.2' }}>
              {registro.mensajeCorto}
            </Text>
            <Text style={{ fontSize: '12px', color: '#605e5c', lineHeight: '1.2' }}>
              {registro.usuarioEjecutor} • {auditoriaService.formatearFecha(registro.fechaHora)}
            </Text>
          </Stack>
        </Stack>
      </div>
    );
  }

  return (
    <div
      style={containerStyles}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyles)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, containerStyles)}
      onClick={handleClick}
    >
      <Stack tokens={{ childrenGap: 12 }}>
        {/* Header con severidad */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Icon
              iconName={getSeveridadIcon(registro.severidad)}
              style={{
                color: getSeveridadColor(registro.severidad),
                fontSize: '18px'
              }}
            />
            <Text style={{ fontSize: '16px', fontWeight: '600' }}>
              {registro.mensajeCorto}
            </Text>
          </Stack>
          
          <Text style={{ fontSize: '12px', color: '#605e5c' }}>
            {auditoriaService.formatearFecha(registro.fechaHora)}
          </Text>
        </Stack>

        {/* Usuario */}
        <Persona
          text={registro.usuarioEjecutor}
          secondaryText={registro.usuarioAfectado || undefined}
          size={PersonaSize.size32}
          styles={{
            root: { cursor: 'default' },
            primaryText: { fontSize: '14px', fontWeight: '500' },
            secondaryText: { fontSize: '12px', color: '#605e5c' }
          }}
        />

        {/* Motivo */}
        {registro.motivo && (
          <Stack>
            <Text style={{ fontSize: '12px', fontWeight: '600', color: '#323130' }}>
              Motivo:
            </Text>
            <Text style={{ fontSize: '12px', color: '#605e5c', fontStyle: 'italic' }}>
              {registro.motivo}
            </Text>
          </Stack>
        )}

        {/* IP Address */}
        {mostrarIP && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Icon iconName="Globe" style={{ fontSize: '12px', color: '#605e5c' }} />
            <Text style={{ fontSize: '12px', color: '#605e5c', fontFamily: 'monospace' }}>
              {registro.ipAddress}
            </Text>
          </Stack>
        )}
      </Stack>
    </div>
  );
};
