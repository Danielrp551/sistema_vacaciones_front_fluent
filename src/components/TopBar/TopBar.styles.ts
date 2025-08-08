import type { IStackStyles, IButtonStyles, ITextStyles, ICommandBarStyles } from '@fluentui/react';

export const styles: Record<string, IStackStyles | IButtonStyles | ITextStyles | ICommandBarStyles> = {
  root: {
    root: {
      height: '48px',
      backgroundColor: '#323130',
      borderBottom: 'none',
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      zIndex: 1000,
    },
  } as IStackStyles,
  
  container: {
    root: {
      height: '100%',
      padding: '0 16px',
      justifyContent: 'space-between',
    },
  } as IStackStyles,

  leftSection: {
    root: {
      gap: '16px',
    },
  } as IStackStyles,

  rightSection: {
    root: {
      gap: '12px',
    },
  } as IStackStyles,

  menuButton: {
    root: {
      color: '#ffffff',
      fontSize: '16px',
      minWidth: '32px',
      width: '32px',
      height: '32px',
    },
    rootHovered: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
    },
    rootPressed: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: '#ffffff',
    },
  } as IButtonStyles,

  title: {
    root: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '16px',
    },
  } as ITextStyles,

  titleAccent: {
    root: {
      color: '#ffeb3b',
      fontWeight: '600',
      fontSize: '16px',
    },
  } as ITextStyles,

  actionButton: {
    root: {
      color: '#ffffff',
      fontSize: '16px',
      minWidth: '32px',
      width: '32px',
      height: '32px',
    },
    rootHovered: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
    },
    rootPressed: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: '#ffffff',
    },
  } as IButtonStyles,

  avatar: {
    root: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#d13438',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#b8292d',
      },
    },
  } as IStackStyles,

  avatarText: {
    root: {
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '600',
    },
  } as ITextStyles,
};
