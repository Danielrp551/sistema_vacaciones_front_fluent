import type { IStackStyles } from '@fluentui/react';

export const styles: Record<string, IStackStyles> = {
  root: {
    root: {
      height: '100vh',
      width: '100vw',
      padding: 0,
    },
  },
  leftPane: {
    root: {
      display: 'block',
    },
  },
  rightPane: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 32,
      paddingRight: 32,
    },
  },
  form: {
    root: {
      width: 420,
      maxWidth: '90%',
    },
  },
};
