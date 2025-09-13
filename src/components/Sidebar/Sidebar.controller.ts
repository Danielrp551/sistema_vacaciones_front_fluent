import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';
import type { INavLinkGroup } from '@fluentui/react';

interface NavItem {
  key: string;
  name: string;
  icon: string;
  url?: string;
  children?: NavItem[];
}

export const useSidebarController = () => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['administracion']);

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      icon: 'ViewDashboard',
      url: '/dashboard',
    },
    {
      key: 'solicitar-vacaciones',
      name: 'Solicitar Vacaciones',
      icon: 'Calendar',
      url: '/solicitar-vacaciones',
    },
    {
      key: 'solicitudes',
      name: 'Mis Solicitudes',
      icon: 'ClipboardList',
      url: '/solicitudes',
    },
    {
      key: 'reporte-equipo',
      name: 'Reporte de Equipo',
      icon: 'PeopleBlock',
      children: [
        {
          key: 'gestion-solicitudes',
          name: 'Gestión de Solicitudes',
          icon: 'TaskManager',
          url: '/reporte-equipo/gestion-solicitudes',
        },
        {
          key: 'saldos-vacaciones',
          name: 'Saldos de Vacaciones',
          icon: 'Calculator',
          url: '/reporte-equipo/saldos-vacaciones',
        },
        {
          key: 'programacion-vacaciones',
          name: 'Programación de Vacaciones',
          icon: 'EventDate',
          url: '/reporte-equipo/programacion-vacaciones',
        },
      ],
    },
    {
      key: 'administracion',
      name: 'Administración',
      icon: 'Settings',
      children: [
        {
          key: 'usuarios',
          name: 'Usuarios',
          icon: 'People',
          url: '/administracion/usuarios',
        },
        {
          key: 'roles',
          name: 'Roles',
          icon: 'SecurityGroup',
          url: '/administracion/roles',
        },
        {
          key: 'permisos',
          name: 'Permisos',
          icon: 'Permissions',
          url: '/administracion/permisos',
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
    navItems,
    isCollapsed: isSidebarCollapsed,
    onLinkClick,
    onToggleCollapse,
    currentPath: location.pathname,
    expandedItems,
    toggleExpanded,
  };
};
