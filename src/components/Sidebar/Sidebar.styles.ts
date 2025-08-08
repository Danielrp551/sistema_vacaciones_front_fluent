import type { IStackStyles, IButtonStyles, ITextStyles, INavStyles } from '@fluentui/react';

export const styles: Record<string, IStackStyles | IButtonStyles | ITextStyles | INavStyles> = {
  root: {
    root: {
      width: '240px',
      minWidth: '240px',
      height: '100%',
      backgroundColor: '#323130', // Mismo color que la TopBar
      borderRight: 'none',
      boxShadow: '2px 0 4px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      transform: 'translateX(0)',
      opacity: 1,
    },
  } as IStackStyles,

  rootCollapsed: {
    root: {
      width: '0px',
      minWidth: '0px',
      height: '100%',
      backgroundColor: '#323130', // Mismo color que la TopBar
      borderRight: 'none',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      transform: 'translateX(-100%)',
      opacity: 0,
      overflow: 'hidden',
    },
  } as IStackStyles,

  navContainer: {
    root: {
      flex: 1,
      overflow: 'hidden',
      padding: '16px 0',
    },
  } as IStackStyles,

  // Elementos principales de navegación
  navItem: {
    root: {
      padding: '12px 20px',
      cursor: 'pointer',
      borderBottom: 'none',
      transition: 'background-color 0.2s ease',
      minHeight: '48px',
      alignItems: 'center',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    }
  } as IStackStyles,

  navItemSelected: {
    root: {
      padding: '12px 20px',
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRight: '3px solid #0078d4',
      minHeight: '48px',
      alignItems: 'center',
    }
  } as IStackStyles,

  navIcon: {
    root: {
      marginRight: '12px',
      minWidth: '20px',
      color: 'white',
      backgroundColor: 'transparent',
      border: 'none',
    },
    icon: {
      fontSize: '16px',
      color: 'white',
    }
  } as IButtonStyles,

  navText: {
    root: {
      fontSize: '14px',
      fontWeight: '400',
      color: 'white',
      flex: 1,
      textAlign: 'left',
    }
  } as ITextStyles,

  chevronIcon: {
    root: {
      minWidth: '20px',
      color: 'white',
      backgroundColor: 'transparent !important',
      border: 'none',
      marginLeft: 'auto',
      ':hover': {
        backgroundColor: 'transparent !important',
      },
      ':focus': {
        backgroundColor: 'transparent !important',
      },
      ':active': {
        backgroundColor: 'transparent !important',
      }
    },
    icon: {
      fontSize: '12px',
      color: 'white',
    },
    rootHovered: {
      backgroundColor: 'transparent !important',
    },
    rootPressed: {
      backgroundColor: 'transparent !important',
    },
    rootFocused: {
      backgroundColor: 'transparent !important',
    }
  } as IButtonStyles,

  // Contenedor de subelementos
  subNavContainer: {
    root: {
      marginLeft: '20px',
      borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
      paddingLeft: '20px',
    }
  } as IStackStyles,

  // Subelementos de navegación
  subNavItem: {
    root: {
      padding: '10px 20px',
      cursor: 'pointer',
      borderBottom: 'none',
      transition: 'background-color 0.2s ease',
      minHeight: '44px',
      alignItems: 'center',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      }
    }
  } as IStackStyles,

  subNavItemSelected: {
    root: {
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderRight: '3px solid #0078d4',
      minHeight: '44px',
      alignItems: 'center',
    }
  } as IStackStyles,

  subNavIcon: {
    root: {
      marginRight: '12px',
      minWidth: '18px',
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: 'transparent',
      border: 'none',
    },
    icon: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.85)',
    }
  } as IButtonStyles,

  subNavText: {
    root: {
      fontSize: '14px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'left',
    }
  } as ITextStyles,

  nav: {
    root: {
      width: '100%',
    },
  } as INavStyles,
};
