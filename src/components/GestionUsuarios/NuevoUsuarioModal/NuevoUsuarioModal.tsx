import React, { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Text,
  TextField,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Checkbox,
} from '@fluentui/react';
import { useGestionUsuarios, useUsuarioDetalle, useUpdateUsuario } from '../../../hooks/useGestionUsuarios';
import type { CreateUsuarioFormData, FormErrors } from '../../../hooks/useGestionUsuarios';

// ============================================================================
// INTERFACES DEL COMPONENTE
// ============================================================================

export interface UsuarioDepartamento {
  id: string;
  nombre: string;
}

export interface UsuarioJefe {
  id: string;
  nombreCompleto: string;
}

export type ModalMode = 'create' | 'view' | 'edit';

interface NuevoUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  // Props para dropdowns
  departamentos: UsuarioDepartamento[];
  roles: string[];
  jefes: UsuarioJefe[];
  dropdownsLoading?: boolean;
  // Props para modos
  mode: ModalMode;
  usuarioId?: string; // Required for 'view' and 'edit' modes
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const NuevoUsuarioModal: React.FC<NuevoUsuarioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  departamentos,
  roles,
  jefes,
  dropdownsLoading = false,
  mode,
  usuarioId,
}) => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [formData, setFormData] = useState<CreateUsuarioFormData>({
    // Información personal
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    extranjero: false,
    numeroCelular: '',
    
    // Información de cuenta
    email: '',
    contrasenaTemporal: '',
    forzarCambioContrasena: true,
    
    // Información laboral
    fechaIngreso: new Date().toISOString().split('T')[0], // Fecha actual como default
    empresa: '',
    departamentoId: '',
    jefeId: '',
    
    // Configuración
    roles: [],
    estadoInicial: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null); // Para controlar si ya cargamos este usuario

  // ============================================================================
  // HOOKS
  // ============================================================================

  const {
    isCreatingUsuario,
    createUsuarioError,
    createUsuarioFieldErrors,
    createUsuario,
    clearCreateUsuarioError,
    clearCreateUsuarioFieldErrors
  } = useGestionUsuarios();

  // Hook para obtener detalles del usuario (solo para modos view/edit)
  const {
    getUsuario,
    mapToFormData,
    loading: usuarioLoading,
    error: usuarioError
  } = useUsuarioDetalle();

  // Hook para actualizar usuario (solo para modo edit)
  const {
    isUpdatingUsuario,
    updateUsuarioError,
    updateUsuarioFieldErrors,
    updateUsuario,
    clearUpdateUsuarioError,
    clearUpdateUsuarioFieldErrors
  } = useUpdateUsuario();

  // Variables derivadas del modo
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const needsUsuarioData = isViewMode || isEditMode;
  const isFormDisabled = isCreatingUsuario || isUpdatingUsuario || isViewMode;

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Efecto para cargar datos del usuario cuando se abra el modal en modo view/edit
  useEffect(() => {
    const loadUsuarioData = async () => {
      // Solo cargar si:
      // 1. El modal está abierto
      // 2. Necesitamos datos del usuario (view/edit)
      // 3. Tenemos un usuarioId
      // 4. No hemos cargado ya este usuario
      if (isOpen && needsUsuarioData && usuarioId && loadedUserId !== usuarioId) {
        try {
          const usuario = await getUsuario(usuarioId);
          const formDataFromUsuario = mapToFormData(usuario);
          if (formDataFromUsuario) {
            setFormData(formDataFromUsuario);
            setLoadedUserId(usuarioId); // Marcar como cargado
          }
        } catch (error) {
          onError('Error al cargar los datos del usuario');
          onClose();
        }
      }
    };

    loadUsuarioData();
  }, [isOpen, needsUsuarioData, usuarioId, loadedUserId]); // Solo dependencias esenciales

  useEffect(() => {
    if (!isOpen) {
      // Solo resetear formulario en modo create
      if (mode === 'create') {
        setFormData({
          // Información personal
          nombres: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          dni: '',
          extranjero: false,
          numeroCelular: '',
          
          // Información de cuenta
          email: '',
          contrasenaTemporal: '',
          forzarCambioContrasena: true,
          
          // Información laboral
          fechaIngreso: new Date().toISOString().split('T')[0],
          empresa: '',
          departamentoId: '',
          jefeId: '',
          
          // Configuración
          roles: [],
          estadoInicial: true,
        });
      }
      setErrors({});
      setLoadedUserId(null); // Reset del usuario cargado
      clearCreateUsuarioError();
      clearCreateUsuarioFieldErrors();
      clearUpdateUsuarioError();
      clearUpdateUsuarioFieldErrors();
    }
  }, [isOpen, mode, clearCreateUsuarioError, clearCreateUsuarioFieldErrors, clearUpdateUsuarioError, clearUpdateUsuarioFieldErrors]);

  useEffect(() => {
    // Combinar errores del hook con errores locales
    setErrors(prev => ({ 
      ...prev, 
      ...createUsuarioFieldErrors, 
      ...updateUsuarioFieldErrors 
    }));
  }, [createUsuarioFieldErrors, updateUsuarioFieldErrors]);

  // ============================================================================
  // FUNCIONES DE VALIDACIÓN
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }

    // Validar apellido paterno
    if (!formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = 'El apellido paterno es requerido';
    }

    // Validar apellido materno
    if (!formData.apellidoMaterno.trim()) {
      newErrors.apellidoMaterno = 'El apellido materno es requerido';
    }

    // Validar DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    // Validar fecha de ingreso
    if (!formData.fechaIngreso) {
      newErrors.fechaIngreso = 'La fecha de ingreso es requerida';
    }

    // Validar empresa
    if (!formData.empresa.trim()) {
      newErrors.empresa = 'La empresa es requerida';
    }

    // Validar departamento
    if (!formData.departamentoId) {
      newErrors.departamentoId = 'El departamento es requerido';
    }

    // Validar roles
    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'Debe seleccionar al menos un rol';
    }

    // Validar número celular si se proporciona
    if (formData.numeroCelular && formData.numeroCelular.trim() && !/^\d{9}$/.test(formData.numeroCelular)) {
      newErrors.numeroCelular = 'El número de celular debe tener 9 dígitos';
    }

    // Validar contraseña temporal si se proporciona
    if (formData.contrasenaTemporal && formData.contrasenaTemporal.trim()) {
      const password = formData.contrasenaTemporal.trim();
      const passwordErrors: string[] = [];

      // Validar longitud mínima
      if (password.length < 12) {
        passwordErrors.push('al menos 12 caracteres');
      }

      // Validar mayúscula
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('al menos una letra mayúscula');
      }

      // Validar minúscula
      if (!/[a-z]/.test(password)) {
        passwordErrors.push('al menos una letra minúscula');
      }

      // Validar número
      if (!/\d/.test(password)) {
        passwordErrors.push('al menos un número');
      }

      // Validar carácter especial
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        passwordErrors.push('al menos un carácter especial');
      }

      if (passwordErrors.length > 0) {
        newErrors.contrasenaTemporal = `La contraseña debe tener: ${passwordErrors.join(', ')}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // FUNCIONES DE MANEJO
  // ============================================================================

  const handleFieldChange = (field: keyof CreateUsuarioFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (isViewMode) {
      // En modo view no hay submit
      return;
    }

    if (isEditMode) {
      // Implementar lógica de edición
      if (!usuarioId) {
        onError('ID de usuario requerido para edición');
        return;
      }

      await updateUsuario(
        usuarioId,
        formData,
        {
          onSuccess: (message) => {
            onSuccess(message);
            onClose();
          },
          onError: (error) => {
            onError(error);
          }
        }
      );
      return;
    }

    // Modo create
    await createUsuario(
      formData,
      (response) => {
        // Éxito
        onSuccess(response.message || 'Usuario creado correctamente');
        onClose();
      },
      (error) => {
        // Error
        onError(error);
      }
    );
  };

  const handleClose = () => {
    if (!isCreatingUsuario) {
      onClose();
    }
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      isBlocking={true}
      containerClassName="nuevo-usuario-modal"
    >
      <Stack
        styles={{
          root: {
            minWidth: '600px',
            maxWidth: '800px',
            maxHeight: '80vh', // Limitar altura máxima al 80% del viewport
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden', // Evitar scroll en el Stack principal
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        tokens={{ childrenGap: 20 }}
      >
        {/* Header */}
        <Stack styles={{ root: { flexShrink: 0 } }}>
          <Text
            styles={{
              root: {
                fontSize: '20px',
                fontWeight: '600',
                color: '#323130',
                marginBottom: '8px',
              },
            }}
          >
            {mode === 'create' && 'Crear Nuevo Usuario'}
            {mode === 'view' && 'Ver Detalles del Usuario'}
            {mode === 'edit' && 'Editar Usuario'}
          </Text>
          <Text
            styles={{
              root: {
                fontSize: '14px',
                color: '#605e5c',
              },
            }}
          >
            {mode === 'create' && 'Complete la información del nuevo usuario del sistema'}
            {mode === 'view' && 'Información detallada del usuario seleccionado'}
            {mode === 'edit' && 'Modifique la información del usuario'}
          </Text>
        </Stack>

        {/* Loading state */}
        {(dropdownsLoading || usuarioLoading) && (
          <MessageBar messageBarType={MessageBarType.info}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Spinner size={SpinnerSize.xSmall} />
              <Text>
                {dropdownsLoading && 'Cargando opciones...'}
                {usuarioLoading && 'Cargando datos del usuario...'}
              </Text>
            </Stack>
          </MessageBar>
        )}

        {/* Error state */}
        {(createUsuarioError || updateUsuarioError || usuarioError) && (
          <MessageBar 
            messageBarType={MessageBarType.error}
            onDismiss={() => {
              clearCreateUsuarioError();
              clearUpdateUsuarioError();
              // TODO: clearUsuarioError when available
            }}
          >
            {createUsuarioError || updateUsuarioError || usuarioError}
          </MessageBar>
        )}

        {/* Formulario en Grid */}
        <Stack 
          tokens={{ childrenGap: 16 }}
          styles={{
            root: {
              flex: 1, // Tomar el espacio disponible
              overflowY: 'auto', // Permitir scroll solo en el contenido del formulario
              paddingRight: '8px', // Compensar el espacio del scrollbar
              marginRight: '-8px', // Ajustar para que el scrollbar quede en el borde
            },
          }}
        >
          {/* Fila 1: Email + Extranjero y DNI */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <Stack tokens={{ childrenGap: 8 }}>
                <TextField
                  label="Email"
                  placeholder="usuario@empresa.com"
                  value={formData.email}
                  onChange={(_, value) => handleFieldChange('email', value || '')}
                  errorMessage={errors.email}
                  required
                  disabled={isFormDisabled}
                  readOnly={isViewMode}
                />
                <Checkbox
                  label="Es extranjero"
                  checked={formData.extranjero}
                  onChange={(_, checked) => handleFieldChange('extranjero', checked || false)}
                  disabled={isFormDisabled}
                  styles={{ 
                    root: { marginTop: '4px' },
                    text: { fontSize: '14px' }
                  }}
                />
              </Stack>
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="DNI"
                placeholder="12345678"
                value={formData.dni}
                onChange={(_, value) => handleFieldChange('dni', value || '')}
                errorMessage={errors.dni}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
                maxLength={8}
              />
            </Stack>
          </Stack>

          {/* Fila 2: Nombres y Apellido Paterno */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Nombres"
                placeholder="Juan Carlos"
                value={formData.nombres}
                onChange={(_, value) => handleFieldChange('nombres', value || '')}
                errorMessage={errors.nombres}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
              />
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Apellido Paterno"
                placeholder="García"
                value={formData.apellidoPaterno}
                onChange={(_, value) => handleFieldChange('apellidoPaterno', value || '')}
                errorMessage={errors.apellidoPaterno}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
              />
            </Stack>
          </Stack>

          {/* Fila 3: Apellido Materno y Número Celular */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Apellido Materno"
                placeholder="López"
                value={formData.apellidoMaterno}
                onChange={(_, value) => handleFieldChange('apellidoMaterno', value || '')}
                errorMessage={errors.apellidoMaterno}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
              />
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Número Celular (Opcional)"
                placeholder="987654321"
                value={formData.numeroCelular || ''}
                onChange={(_, value) => handleFieldChange('numeroCelular', value || '')}
                errorMessage={errors.numeroCelular}
                disabled={isFormDisabled}
                readOnly={isViewMode}
                maxLength={9}
              />
            </Stack>
          </Stack>

          {/* Fila 4: Fecha de Ingreso y Empresa */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Fecha de Ingreso"
                type="date"
                value={formData.fechaIngreso}
                onChange={(_, value) => handleFieldChange('fechaIngreso', value || '')}
                errorMessage={errors.fechaIngreso}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
              />
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              <TextField
                label="Empresa"
                placeholder="Nombre de la empresa"
                value={formData.empresa}
                onChange={(_, value) => handleFieldChange('empresa', value || '')}
                errorMessage={errors.empresa}
                required
                disabled={isFormDisabled}
                readOnly={isViewMode}
              />
            </Stack>
          </Stack>

          {/* Fila 5: Departamento y Roles */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <Dropdown
                label="Departamento"
                placeholder="Seleccionar departamento"
                options={departamentos.map((dept: UsuarioDepartamento) => ({
                  key: dept.id,
                  text: dept.nombre
                }))}
                selectedKey={formData.departamentoId}
                onChange={(_, option) => handleFieldChange('departamentoId', option?.key as string || '')}
                errorMessage={errors.departamentoId}
                required
                disabled={isFormDisabled || dropdownsLoading}
              />
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              <Dropdown
                label="Roles"
                placeholder="Seleccionar roles"
                multiSelect
                options={roles.map((rol: string) => ({
                  key: rol,
                  text: rol
                }))}
                selectedKeys={formData.roles}
                onChange={(_, option) => {
                  if (option) {
                    let newRoles: string[] = [...formData.roles];
                    
                    if (option.selected) {
                      // Agregar rol si no está en la lista
                      if (!newRoles.includes(option.key as string)) {
                        newRoles.push(option.key as string);
                      }
                    } else {
                      // Remover rol de la lista
                      newRoles = newRoles.filter(role => role !== option.key);
                    }
                    
                    handleFieldChange('roles', newRoles);
                  }
                }}
                errorMessage={errors.roles}
                required
                disabled={isFormDisabled || dropdownsLoading}
              />
            </Stack>
          </Stack>

          {/* Fila 6: Jefe Inmediato + Forzar Cambio y Contraseña Temporal */}
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <Stack tokens={{ childrenGap: 8 }}>
                <Dropdown
                  label="Jefe Inmediato (Opcional)"
                  placeholder="Seleccionar jefe"
                  options={jefes.map((jefe: UsuarioJefe) => ({
                    key: jefe.id,
                    text: jefe.nombreCompleto
                  }))}
                  selectedKey={formData.jefeId || ''}
                  onChange={(_, option) => handleFieldChange('jefeId', option?.key as string || '')}
                  disabled={isFormDisabled || dropdownsLoading}
                />
                <Checkbox
                  label="Forzar cambio de contraseña en el primer login"
                  checked={formData.forzarCambioContrasena}
                  onChange={(_, checked) => handleFieldChange('forzarCambioContrasena', checked || false)}
                  disabled={isFormDisabled}
                  styles={{ 
                    root: { marginTop: '4px' },
                    text: { fontSize: '14px' }
                  }}
                />
              </Stack>
            </Stack>
            <Stack styles={{ root: { flex: 1 } }}>
              {/* Solo mostrar contraseña en modo create */}
              {mode === 'create' && (
                <TextField
                  label="Contraseña Temporal (Opcional)"
                  type="password"
                  placeholder="Mínimo 12 caracteres"
                  value={formData.contrasenaTemporal || ''}
                  onChange={(_, value) => handleFieldChange('contrasenaTemporal', value || '')}
                  errorMessage={errors.contrasenaTemporal}
                  disabled={isFormDisabled}
                  description="Debe tener: 12+ caracteres, mayúscula, minúscula, número y carácter especial. Si no se especifica, se generará automáticamente."
                />
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Botones de acción */}
        <Stack
          horizontal
          horizontalAlign="end"
          tokens={{ childrenGap: 12 }}
          styles={{ 
            root: { 
              marginTop: '20px', 
              paddingTop: '20px', 
              borderTop: '1px solid #edebe9',
              flexShrink: 0, // No permitir que se comprima
            } 
          }}
        >
          <DefaultButton
            text={isViewMode ? "Cerrar" : "Cancelar"}
            onClick={handleClose}
            disabled={!isViewMode && (isCreatingUsuario || isUpdatingUsuario)}
          />
          {/* Solo mostrar botón de acción en modos create/edit */}
          {!isViewMode && (
            <PrimaryButton
              text={
                (isCreatingUsuario || isUpdatingUsuario) ? 'Procesando...' : 
                mode === 'create' ? 'Crear Usuario' : 
                'Actualizar Usuario'
              }
              onClick={handleSubmit}
              disabled={isFormDisabled || dropdownsLoading}
              iconProps={(isCreatingUsuario || isUpdatingUsuario) ? undefined : { 
                iconName: mode === 'create' ? 'AddFriend' : 'Edit' 
              }}
            />
          )}
        </Stack>

        {/* Spinner overlay para el submit */}
        {(isCreatingUsuario || isUpdatingUsuario) && (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            styles={{
              root: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '4px',
              },
            }}
          >
            <Stack horizontalAlign="center" tokens={{ childrenGap: 12 }}>
              <Spinner size={SpinnerSize.large} />
              <Text>
                {mode === 'create' && 'Creando usuario...'}
                {mode === 'edit' && 'Actualizando usuario...'}
              </Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};
