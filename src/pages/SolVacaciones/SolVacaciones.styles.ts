import type { IStackStyles, ITextStyles, IButtonStyles } from '@fluentui/react';

export const styles = {
  root: {
    root: {
      maxWidth: '100%',
      width: '100%',
      margin: '0',
      padding: '0',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
    },
  } as IStackStyles,

  pageTitle: {
    root: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#323130',
      marginBottom: '20px',
      paddingTop: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      flexShrink: 0,
    },
  } as ITextStyles,

  formContainer: {
    root: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '4px',
      boxShadow: '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108)',
      marginBottom: '20px',
      marginLeft: '20px',
      marginRight: '20px',
      flexShrink: 0,
    },
  } as IStackStyles,

  formGrid: {
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '16px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
  } as IStackStyles,

  fullWidthField: {
    root: {
      gridColumn: '1 / -1',
    },
  } as IStackStyles,

  submitButton: {
    root: {
      marginTop: '16px',
      height: '40px',
      fontSize: '14px',
      fontWeight: '600',
      maxWidth: '200px',
    },
    rootHovered: {
      backgroundColor: '#106ebe',
    },
    rootPressed: {
      backgroundColor: '#005a9e',
    },
  } as IButtonStyles,

  sectionTitle: {
    root: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#323130',
      marginBottom: '16px',
      marginTop: '20px',
      flexShrink: 0,
    },
  } as ITextStyles,

  historialSection: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
    },
  } as IStackStyles,

  tableContainer: {
    root: {
      minHeight: '200px',
      width: '100%',
    },
  } as IStackStyles,

  periodInfo: {
    root: {
      padding: '12px 16px',
      backgroundColor: '#f3f2f1',
      borderRadius: '4px',
      marginTop: '16px',
      fontSize: '14px',
      color: '#605e5c',
    },
  } as IStackStyles,

  loadingContainer: {
    root: {
      padding: '40px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  } as IStackStyles,

  emptyState: {
    root: {
      padding: '40px',
      textAlign: 'center',
      color: '#605e5c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  } as IStackStyles,

  datePickerContainer: {
    root: {
      width: '100%',
    },
  } as IStackStyles,

  // Estilos para la notificación de éxito
  successNotification: {
    root: {
      position: 'fixed',
      top: '70px',
      right: '24px',
      zIndex: 1000,
      minWidth: '320px',
      maxWidth: '400px',
      backgroundColor: '#107c10',
      color: '#ffffff',
      padding: '12px 16px',
      borderRadius: '6px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      animation: 'slideInRight 0.3s ease-out',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
    },
  } as IStackStyles,

  notificationText: {
    root: {
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      flex: 1,
      paddingTop: '2px',
    },
  } as ITextStyles,

  notificationCloseButton: {
    root: {
      color: '#ffffff',
      minWidth: '28px',
      width: '28px',
      height: '28px',
      padding: '0',
      borderRadius: '4px',
      flexShrink: 0,
    },
    rootHovered: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    rootPressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  } as IButtonStyles,
};
