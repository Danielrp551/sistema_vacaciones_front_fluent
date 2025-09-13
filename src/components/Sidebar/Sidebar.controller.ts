import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../types/permissions';
import type { INavLinkGroup } from '@fluentui/react';

interface NavItem {
  key: string;
  name: string;
  icon: string;
  url?: string;
  children?: NavItem[];
  permisos?: string[]; // Códigos de permiso requeridos para mostrar este elemento
}

export const useSidebarController = () => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['administracion']);

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      icon: 'ViewDashboard',
      url: '/dashboard',
      permisos: [PERMISOS.DASHBOARD_MENU], // ← PERMISO AGREGADO
    },
    {
      key: 'solicitar-vacaciones',
      name: 'Solicitar Vacaciones',
      icon: 'Calendar',
      url: '/solicitar-vacaciones',
      permisos: [PERMISOS.SOLICITAR_VACACIONES_MENU], // ← PERMISO AGREGADO
    },
    {
      key: 'solicitudes',
      name: 'Mis Solicitudes',
      icon: 'ClipboardList',
      url: '/solicitudes',
      permisos: [PERMISOS.MIS_SOLICITUDES_MENU], // ← PERMISO AGREGADO
    },
    {
      key: 'reporte-equipo',
      name: 'Reporte de Equipo',
      icon: 'PeopleBlock',
      permisos: [PERMISOS.REPORTE_EQUIPO_MENU], // ← PERMISO AGREGADO
      children: [
        {
          key: 'gestion-solicitudes',
          name: 'Gestión de Solicitudes',
          icon: 'TaskManager',
          url: '/reporte-equipo/gestion-solicitudes',
          permisos: [PERMISOS.GESTION_SOLICITUDES_MENU], // ← PERMISO AGREGADO
        },
        {
          key: 'saldos-vacaciones',
          name: 'Saldos de Vacaciones',
          icon: 'Calculator',
          url: '/reporte-equipo/saldos-vacaciones',
          permisos: [PERMISOS.SALDOS_VACACIONES_MENU], // ← PERMISO AGREGADO
        },
        {
          key: 'programacion-vacaciones',
          name: 'Programación de Vacaciones',
          icon: 'EventDate',
          url: '/reporte-equipo/programacion-vacaciones',
          permisos: [PERMISOS.PROGRAMACION_VACACIONES_MENU], // ← PERMISO AGREGADO
        },
      ],
    },
    {
      key: 'administracion',
      name: 'Administración',
      icon: 'Settings',
      permisos: [PERMISOS.ADMIN_MENU], // ← PERMISO AGREGADO
      children: [
        {
          key: 'usuarios',
          name: 'Usuarios',
          icon: 'People',
          url: '/administracion/usuarios',
          permisos: [PERMISOS.ADMIN_USUARIOS_MENU], // ← PERMISO AGREGADO
        },
        {
          key: 'roles',
          name: 'Roles',
          icon: 'SecurityGroup',
          url: '/administracion/roles',
          permisos: [PERMISOS.ADMIN_ROLES_MENU], // ← PERMISO AGREGADO
        },
        {
          key: 'permisos',
          name: 'Permisos',
          icon: 'Permissions',
          url: '/administracion/permisos',
          permisos: [PERMISOS.ADMIN_PERMISOS_MENU], // ← PERMISO AGREGADO
        },
        {
          key: 'departamentos',
          name: 'Departamentos',
          icon: 'Org',
          url: '/administracion/departamentos',
        },
        {
          key: 'configuracion',
          name: 'Configuración',
          icon: 'Settings',
          url: '/administracion/configuracion',
        },
      ],
    },
    {
      key: 'reportes',
      name: 'Reportes',
      icon: 'BarChart4',
      children: [
        {
          key: 'vacaciones-por-usuario',
          name: 'Vacaciones por Usuario',
          icon: 'UserOptional',
          url: '/reportes/vacaciones-usuario',
        },
        {
          key: 'estadisticas',
          name: 'Estadísticas',
          icon: 'Financial',
          url: '/reportes/estadisticas',
        },
      ],
    },
  ];

  const onToggleCollapse = () => {
    toggleSidebar();
  };

  const onLinkClick = (item: any) => {
    if (item?.url) {
      navigate(item.url);
    }
  };

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(key => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  // Función para filtrar elementos del menú basado en permisos
  const filterNavItemsByPermissions = (items: NavItem[]): NavItem[] => {
    return items.filter(item => {
      // Si el elemento no tiene permisos definidos, se muestra
      if (!item.permisos || item.permisos.length === 0) {
        // Si tiene hijos, filtrar recursivamente
        if (item.children) {
          const filteredChildren = filterNavItemsByPermissions(item.children);
          return { ...item, children: filteredChildren };
        }
        return item;
      }

      // Si tiene permisos definidos, verificar si el usuario los tiene
      const hasRequiredPermission = hasPermission(item.permisos);
      
      if (hasRequiredPermission) {
        // Si tiene hijos, filtrar recursivamente
        if (item.children) {
          const filteredChildren = filterNavItemsByPermissions(item.children);
          return { ...item, children: filteredChildren };
        }
        return item;
      }

      // No tiene permisos, no mostrar este elemento
      return null;
    }).filter(Boolean).map(item => {
      // Procesar hijos recursivamente
      if (item.children) {
        return { ...item, children: filterNavItemsByPermissions(item.children) };
      }
      return item;
    });
  };

  // Filtrar elementos del menú basado en permisos
  const filteredNavItems = filterNavItemsByPermissions(navItems);

  const navLinkGroups: INavLinkGroup[] = [
    {
      name: '', // Sin nombre para ocultar el header
      links: [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'ViewDashboard',
          key: '/dashboard',
        },
        {
          name: 'Solicitar Vacaciones',
          url: '/solicitar-vacaciones',
          icon: 'Calendar',
          key: '/solicitar-vacaciones',
        },
        {
          name: 'Mis Solicitudes',
          url: '/solicitudes',
          icon: 'ClipboardList',
          key: '/solicitudes',
        },
        {
          name: 'Reporte de Equipo',
          url: '/reporte-equipo',
          icon: 'PeopleBlock',
          key: '/reporte-equipo',
        },
        {
          name: 'Administración',
          url: '/administracion',
          icon: 'Settings',
          key: '/administracion',
        },
        {
          name: 'Reportes',
          url: '/reportes',
          icon: 'BarChart4',
          key: '/reportes',
        },
      ],
    },
  ];

  return {
    navLinkGroups,
    navItems: filteredNavItems, // ← Usar elementos filtrados
    isCollapsed: isSidebarCollapsed,
    onLinkClick,
    onToggleCollapse,
    currentPath: location.pathname,
    expandedItems,
    toggleExpanded,
  };
};
