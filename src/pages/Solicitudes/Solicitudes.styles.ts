import type { IStackStyles, ITextStyles } from '@fluentui/react';

// Estilos para modales optimizados (consistente con GestionSolicitudes)
export const optimizedModalStyles = {
  main: {
    width: '80vw' as const,
    maxWidth: '1100px',
    minWidth: '800px',
    maxHeight: '80vh' as const,
    minHeight: '500px',
    overflow: 'hidden' as const,
    margin: '5vh auto',
    '@media (max-width: 1400px)': {
      width: '85vw' as const,
      maxWidth: 'none' as const,
      minWidth: '700px',
      maxHeight: '85vh' as const,
      margin: '4vh auto',
    },
    '@media (max-width: 1024px)': {
      width: '90vw' as const,
      maxWidth: 'none' as const,
      minWidth: '600px',
      maxHeight: '90vh' as const,
      margin: '3vh auto',
    },
    '@media (max-width: 768px)': {
      width: '95vw' as const,
      maxWidth: 'none' as const,
      minWidth: '350px',
      maxHeight: '95vh' as const,
      margin: '2vh auto',
    },
  },
};

export const compactModalStyles = {
  main: {
    maxWidth: '500px',
    width: '90vw' as const,
    minWidth: '400px',
    '@media (max-width: 768px)': {
      width: '95vw' as const,
      minWidth: '320px',
    },
  },
};

export const containerStyles: IStackStyles = {
  root: {
    padding: '24px',
    maxWidth: '1200px',
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
    color: '#605e5c',
    margin: 0,
  },
};

export const filtersContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#faf9f8',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '24px',
  },
};

export const statsGridStyles: IStackStyles = {
  root: {
    marginBottom: '24px',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const statCardStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    padding: '16px',
    textAlign: 'center',
    minWidth: '120px',
  },
};

export const statNumberStyles: ITextStyles = {
  root: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#323130',
    margin: '0 0 4px 0',
  },
};

export const statLabelStyles: ITextStyles = {
  root: {
    fontSize: '12px',
    color: '#605e5c',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
};

export const listContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    overflow: 'hidden',
    // Se quitó el border para que coincida con el estilo de vacation-table-container
  },
};

export const tableContainerStyles: IStackStyles = {
  root: {
    minHeight: '200px',
    width: '100%',
  },
};

export const loadingContainerStyles: IStackStyles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
};

export const emptyStateStyles: IStackStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    textAlign: 'center',
  },
};

export const emptyStateIconStyles = {
  fontSize: '48px',
  color: '#a19f9d',
  marginBottom: '16px',
};

export const emptyStateTitleStyles: ITextStyles = {
  root: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '8px',
  },
};

export const emptyStateMessageStyles: ITextStyles = {
  root: {
    fontSize: '14px',
    color: '#605e5c',
    marginBottom: '24px',
    maxWidth: '400px',
  },
};

export const paginationContainerStyles: IStackStyles = {
  root: {
    padding: '16px 20px',
    borderTop: '1px solid #edebe9',
    backgroundColor: '#faf9f8',
  },
};

export const actionButtonsStyles = {
  display: 'flex',
  gap: '8px',
};
