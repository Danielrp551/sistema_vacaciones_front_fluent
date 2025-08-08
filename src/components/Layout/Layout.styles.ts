import type { IStackStyles } from '@fluentui/react';

export const styles: Record<string, IStackStyles> = {
  root: {
    root: {
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    },
  },
  mainContainer: {
    root: {
      height: 'calc(100vh - 48px)', // Restamos la altura de la TopBar actualizada
      overflow: 'hidden',
    },
  },
  content: {
    root: {
      padding: '24px',
      overflow: 'auto',
      backgroundColor: '#faf9f8',
      transition: 'all 0.3s ease',
    },
  },
};
