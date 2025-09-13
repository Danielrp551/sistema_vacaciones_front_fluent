// ============================================================================
// ESTILOS PARA LA PÁGINA DE GESTIÓN DE ROLES
// ============================================================================
// Estilos usando Fluent UI IStyles, manteniendo consistencia con el proyecto
// ============================================================================

import type { IStackStyles, ITextStyles, IButtonStyles, IIconStyles } from '@fluentui/react';

export const containerStyles: IStackStyles = {
  root: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      padding: '16px',
      maxWidth: '100%'
    }
  },
};

export const headerStyles: IStackStyles = {
  root: {
    marginBottom: '24px',
  },
};

export const titleStyles: ITextStyles = {
  root: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#323130',
    margin: 0,
  },
};

export const subtitleStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#605e5c',
    margin: 0,
    marginTop: '4px',
  },
};

export const actionButtonStyles: IButtonStyles = {
  root: {
    minWidth: '120px',
    height: '40px',
  },
  icon: {
    fontSize: '16px',
  },
};

export const filtersContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #e1e5e9',
  },
};

export const filterRowStyles: IStackStyles = {
  root: {
    marginBottom: '16px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
};

export const filterItemStyles: IStackStyles = {
  root: {
    minWidth: '200px',
    maxWidth: '250px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
};

export const statsGridStyles: IStackStyles = {
  root: {
    marginBottom: '24px',
  },
};

export const statCardStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e5e9',
    borderRadius: '6px',
    padding: '20px',
    flex: '1',
    minWidth: '150px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: '#106ebe',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  },
};

export const statNumberStyles: ITextStyles = {
  root: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#106ebe',
    margin: 0,
    lineHeight: '1.2',
  },
};

export const statLabelStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#605e5c',
    margin: 0,
    marginTop: '4px',
  },
};

export const tableContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e5e9',
    borderRadius: '6px',
    overflow: 'hidden',
  },
};

export const loadingContainerStyles: IStackStyles = {
  root: {
    padding: '40px',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export const emptyStateStyles: IStackStyles = {
  root: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#fafbfc',
  },
};

export const emptyStateIconStyles: IIconStyles = {
  root: {
    fontSize: '48px',
    color: '#a19f9d',
    marginBottom: '16px',
  },
};

export const emptyStateTitleStyles: ITextStyles = {
  root: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#323130',
    margin: 0,
    marginBottom: '8px',
  },
};

export const emptyStateMessageStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    color: '#605e5c',
    margin: 0,
    lineHeight: '1.4',
  },
};

// Estilos para badges de estado de roles
export const roleBadgeStyles: IStackStyles = {
  root: {
    padding: '4px 12px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#e1f5fe',
    color: '#01579b',
    border: '1px solid #b3e5fc',
  },
};

// Estilos para chips de permisos
export const permisoChipStyles: IStackStyles = {
  root: {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: '#f3f2f1',
    color: '#323130',
    fontSize: '11px',
    fontWeight: '500',
    marginRight: '4px',
    marginBottom: '4px',
    border: '1px solid #edebe9',
  },
};

export const permisosContainerStyles: IStackStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    maxWidth: '300px',
  },
};

// Estilos para el menú contextual de acciones
export const actionMenuStyles = {
  subComponentStyles: {
    menuItem: {
      root: {
        fontSize: '14px',
        padding: '8px 12px',
      },
      icon: {
        fontSize: '14px',
        marginRight: '8px',
      },
    },
  },
};

// Estilos para modales
export const modalStyles = {
  main: {
    maxWidth: '600px',
    '@media (max-width: 768px)': {
      maxWidth: '90vw',
      margin: '0 auto',
    },
  },
};

// Estilos para formularios en modales
export const formFieldStyles: IStackStyles = {
  root: {
    marginBottom: '16px',
  },
};

export const formLabelStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '8px',
    display: 'block',
  },
};

// Estilos para el tab de auditoría
export const auditTabStyles: IStackStyles = {
  root: {
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e5e9',
    borderRadius: '6px',
    marginTop: '16px',
  },
};
