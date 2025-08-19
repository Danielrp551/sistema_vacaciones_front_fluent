// ============================================================================
// COMPONENTE FILTROS PARA TABLA DE USUARIOS
// ============================================================================
// Componente que maneja todos los filtros de búsqueda para la tabla de usuarios
// Incluye filtros de texto, dropdowns, fechas y estado
// ============================================================================

import React, { useState, useEffect } from 'react';
import type {
  UsuariosAdminQueryObject,
  DepartamentoSimple
} from '../../../types/usuarios';

// ============================================================================
// INTERFACES DEL COMPONENTE
// ============================================================================

interface UsuariosFiltersProps {
  query: UsuariosAdminQueryObject;
  departamentos: DepartamentoSimple[];
  roles: string[];
  onFiltersChange: (filters: Partial<UsuariosAdminQueryObject>) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const UsuariosFilters: React.FC<UsuariosFiltersProps> = ({
  query,
  departamentos,
  roles,
  onFiltersChange,
  onClearFilters,
  loading = false
}) => {
  
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================
  
  const [localFilters, setLocalFilters] = useState({
    busquedaGeneral: query.busquedaGeneral || '',
    email: query.email || '',
    departamentoId: query.departamentoId || '',
    rol: query.rol || '',
    estaActivo: query.estaActivo,
    extranjero: query.extranjero,
    fechaIngresoDesde: query.fechaIngresoDesde || '',
    fechaIngresoHasta: query.fechaIngresoHasta || ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // ============================================================================
  // FUNCIONES DE MANEJO
  // ============================================================================

  const handleInputChange = (field: keyof typeof localFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const cleanFilters: Partial<UsuariosAdminQueryObject> = {};
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        (cleanFilters as any)[key] = value;
      }
    });

    onFiltersChange(cleanFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      busquedaGeneral: '',
      email: '',
      departamentoId: '',
      rol: '',
      estaActivo: undefined,
      extranjero: undefined,
      fechaIngresoDesde: '',
      fechaIngresoHasta: ''
    });
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return Object.values(localFilters).some(value => 
      value !== '' && value !== undefined && value !== null
    );
  };

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    setLocalFilters({
      busquedaGeneral: query.busquedaGeneral || '',
      email: query.email || '',
      departamentoId: query.departamentoId || '',
      rol: query.rol || '',
      estaActivo: query.estaActivo,
      extranjero: query.extranjero,
      fechaIngresoDesde: query.fechaIngresoDesde || '',
      fechaIngresoHasta: query.fechaIngresoHasta || ''
    });
  }, [query]);

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros de Búsqueda</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          </button>
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Filtros Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda General */}
        <div className="lg:col-span-2">
          <label htmlFor="busqueda-general" className="block text-sm font-medium text-gray-700 mb-1">
            Búsqueda General
          </label>
          <input
            type="text"
            id="busqueda-general"
            value={localFilters.busquedaGeneral}
            onChange={(e) => handleInputChange('busquedaGeneral', e.target.value)}
            placeholder="Nombre, email, DNI..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <select
            id="departamento"
            value={localFilters.departamentoId}
            onChange={(e) => handleInputChange('departamentoId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los departamentos</option>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            value={localFilters.estaActivo === undefined ? '' : localFilters.estaActivo.toString()}
            onChange={(e) => handleInputChange('estaActivo', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Filtros Avanzados */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Email específico */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email específico
              </label>
              <input
                type="email"
                id="email"
                value={localFilters.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="rol"
                value={localFilters.rol}
                onChange={(e) => handleInputChange('rol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los roles</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            {/* Extranjero */}
            <div>
              <label htmlFor="extranjero" className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad
              </label>
              <select
                id="extranjero"
                value={localFilters.extranjero === undefined ? '' : localFilters.extranjero.toString()}
                onChange={(e) => handleInputChange('extranjero', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las nacionalidades</option>
                <option value="false">Peruanos</option>
                <option value="true">Extranjeros</option>
              </select>
            </div>

            {/* Fecha Ingreso Desde */}
            <div>
              <label htmlFor="fecha-desde" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha ingreso desde
              </label>
              <input
                type="date"
                id="fecha-desde"
                value={localFilters.fechaIngresoDesde}
                onChange={(e) => handleInputChange('fechaIngresoDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Fecha Ingreso Hasta */}
            <div>
              <label htmlFor="fecha-hasta" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha ingreso hasta
              </label>
              <input
                type="date"
                id="fecha-hasta"
                value={localFilters.fechaIngresoHasta}
                onChange={(e) => handleInputChange('fechaIngresoHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={clearAllFilters}
          disabled={loading || !hasActiveFilters()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
        <button
          onClick={applyFilters}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Aplicar Filtros
        </button>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            
            {localFilters.busquedaGeneral && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: {localFilters.busquedaGeneral}
                <button
                  onClick={() => handleInputChange('busquedaGeneral', '')}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <span className="sr-only">Eliminar filtro</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}

            {localFilters.departamentoId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Departamento: {departamentos.find(d => d.id === localFilters.departamentoId)?.nombre}
                <button
                  onClick={() => handleInputChange('departamentoId', '')}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500"
                >
                  <span className="sr-only">Eliminar filtro</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}

            {localFilters.rol && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Rol: {localFilters.rol}
                <button
                  onClick={() => handleInputChange('rol', '')}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                >
                  <span className="sr-only">Eliminar filtro</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}

            {localFilters.estaActivo !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Estado: {localFilters.estaActivo ? 'Activo' : 'Inactivo'}
                <button
                  onClick={() => handleInputChange('estaActivo', undefined)}
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500"
                >
                  <span className="sr-only">Eliminar filtro</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosFilters;
