import { Stack, Text, Checkbox, Toggle, MessageBar, MessageBarType } from '@fluentui/react';
import type { BulkImportConfiguracion } from '../../../types/bulkImport';

// ============================================================================
// TIPOS
// ============================================================================

export interface ConfigurationStepProps {
  entityType: string;
  config: BulkImportConfiguracion;
  onChange: (updates: Partial<BulkImportConfiguracion>) => void;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export const ConfigurationStep = ({
  entityType,
  config,
  onChange
}: ConfigurationStepProps) => {
  const containerStyles = {
    root: {
      padding: '24px'
    }
  };

  const sectionStyles = {
    root: {
      marginBottom: '24px'
    }
  };

  const headerStyles = {
    root: {
      fontSize: '18px',
      fontWeight: '600' as const,
      color: '#323130',
      marginBottom: '8px'
    }
  };

  const descriptionStyles = {
    root: {
      fontSize: '14px',
      color: '#605e5c',
      marginBottom: '20px'
    }
  };

  const labelStyles = {
    root: {
      fontSize: '14px',
      fontWeight: '600' as const,
      color: '#323130',
      marginBottom: '8px'
    }
  };

  const helpTextStyles = {
    root: {
      fontSize: '12px',
      color: '#605e5c',
      marginTop: '4px'
    }
  };

  return (
    <Stack styles={containerStyles}>
      {/* Header */}
      <Stack styles={sectionStyles}>
        <Text styles={headerStyles}>
          Configuración de Importación
        </Text>
        <Text styles={descriptionStyles}>
          Ajusta los parámetros para la importación de {entityType}.
        </Text>
      </Stack>

      <Stack tokens={{ childrenGap: 20 }}>
        {/* Roles por defecto - Solo para usuarios */}
        {entityType === 'usuarios' && (
          <Stack>
            <Text styles={labelStyles}>
              Roles por Defecto
            </Text>
            <Stack tokens={{ childrenGap: 8 }}>
              {['Empleado', 'Jefe', 'Admin'].map(role => (
                <Checkbox
                  key={role}
                  label={role}
                  checked={config.rolesPorDefecto.includes(role)}
                  onChange={(_, checked) => {
                    const newRoles = checked
                      ? [...config.rolesPorDefecto, role]
                      : config.rolesPorDefecto.filter(r => r !== role);
                    onChange({ rolesPorDefecto: newRoles });
                  }}
                />
              ))}
            </Stack>
            <Text styles={helpTextStyles}>
              Se asignará a usuarios sin rol específico
            </Text>
          </Stack>
        )}

        {/* Generar passwords automáticamente */}
        {entityType === 'usuarios' && (
          <Stack>
            <Toggle
              label="Generar Contraseñas Automáticamente"
              checked={config.generarPasswordsAutomaticamente}
              onChange={(_, checked) => onChange({ generarPasswordsAutomaticamente: !!checked })}
              onText="Activado"
              offText="Desactivado"
            />
            <Text styles={helpTextStyles}>
              Se crearán contraseñas temporales para nuevos usuarios
            </Text>
          </Stack>
        )}

        {/* Continuar con errores */}
        <Stack>
          <Toggle
            label="Continuar con Errores"
            checked={config.continuarConErrores}
            onChange={(_, checked) => onChange({ continuarConErrores: !!checked })}
            onText="Activado"
            offText="Desactivado"
          />
          <Text styles={helpTextStyles}>
            Procesar registros válidos aunque algunos tengan errores
          </Text>
        </Stack>

        {/* Validar jefes existentes - Solo para usuarios */}
        {entityType === 'usuarios' && (
          <Stack>
            <Toggle
              label="Validar Jefes Existentes"
              checked={config.validarJefesExistentes}
              onChange={(_, checked) => onChange({ validarJefesExistentes: !!checked })}
              onText="Activado"
              offText="Desactivado"
            />
            <Text styles={helpTextStyles}>
              Verificar que los jefes asignados existan en el sistema
            </Text>
          </Stack>
        )}

        {/* Enviar notificación por email */}
        {entityType === 'usuarios' && (
          <Stack>
            <Toggle
              label="Enviar Notificación por Email"
              checked={config.enviarNotificacionEmail}
              onChange={(_, checked) => onChange({ enviarNotificacionEmail: !!checked })}
              onText="Activado"
              offText="Desactivado"
            />
            <Text styles={helpTextStyles}>
              Notificar a usuarios nuevos sobre su cuenta
            </Text>
          </Stack>
        )}

        {/* Recomendaciones */}
        <MessageBar messageBarType={MessageBarType.warning}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontWeight: '600' as const, fontSize: '14px' } }}>
              Recomendaciones
            </Text>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontSize: '13px' } }}>
                • Habilita "Continuar con errores" para procesar registros válidos
              </Text>
              <Text styles={{ root: { fontSize: '13px' } }}>
                • Revisa la validación antes de procesar para identificar problemas
              </Text>
              {entityType === 'usuarios' && (
                <>
                  <Text styles={{ root: { fontSize: '13px' } }}>
                    • Las contraseñas automáticas son más seguras
                  </Text>
                  <Text styles={{ root: { fontSize: '13px' } }}>
                    • Valida jefes para mantener jerarquías correctas
                  </Text>
                </>
              )}
            </Stack>
          </Stack>
        </MessageBar>
      </Stack>
    </Stack>
  );
};
