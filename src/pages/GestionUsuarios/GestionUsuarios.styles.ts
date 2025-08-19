import type { IStackStyles, ITextStyles, IButtonStyles } from '@fluentui/react';

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
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '16px',
    gap: '12px',
  },
};

export const filterRowStyles: IStackStyles = {
  root: {
    flexWrap: 'wrap',
    gap: '12px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    }
  },
};

export const filterItemStyles: IStackStyles = {
  root: {
    minWidth: '200px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    }
  },
};

export const statsGridStyles: IStackStyles = {
  root: {
    marginBottom: '24px',
    gap: '16px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    }
  },
};

export const statCardStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e5e9',
    borderRadius: '4px',
    padding: '16px',
    minWidth: '140px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
  },
};

export const statNumberStyles: ITextStyles = {
  root: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0078d4',
    lineHeight: '1.2',
  },
};

export const statLabelStyles: ITextStyles = {
  root: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#605e5c',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export const tableContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
};

export const loadingContainerStyles: IStackStyles = {
  root: {
    padding: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
};

export const emptyStateStyles: IStackStyles = {
  root: {
    padding: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    textAlign: 'center',
  },
};

export const emptyStateIconStyles: ITextStyles = {
  root: {
    fontSize: '48px',
    color: '#a19f9d',
    marginBottom: '16px',
  },
};

export const emptyStateTitleStyles: ITextStyles = {
  root: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '8px',
  },
};

export const emptyStateMessageStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    color: '#605e5c',
    maxWidth: '400px',
    lineHeight: '1.4',
  },
};

export const messageBarStyles = {
  root: {
    marginBottom: '16px',
  },
};

export const actionMenuStyles = {
  root: {
    minWidth: '160px',
  },
};

export const dialogStyles = {
  main: {
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      maxWidth: '90vw',
      margin: '0 auto',
    }
  },
};

export const formFieldStyles: IStackStyles = {
  root: {
    marginBottom: '16px',
  },
};

export const statusBadgeActiveStyles = {
  root: {
    backgroundColor: '#e7f5e7',
    color: '#0f7b0f',
    border: '1px solid #0f7b0f',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  },
};

export const statusBadgeInactiveStyles = {
  root: {
    backgroundColor: '#fdf2f2',
    color: '#d13438',
    border: '1px solid #d13438',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  },
};
