import type { IStackStyles, ITextStyles } from '@fluentui/react';

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
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '24px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch'
    }
  },
};

export const statCardStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #edebe9',
    borderRadius: '8px',
    padding: '16px 20px',
    textAlign: 'center',
    minWidth: '140px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
};

export const statNumberStyles: ITextStyles = {
  root: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0078d4',
    margin: '0 0 4px 0',
  },
};

export const statLabelStyles: ITextStyles = {
  root: {
    fontSize: '12px',
    color: '#605e5c',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
};

export const listContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #edebe9',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export const tableContainerStyles: IStackStyles = {
  root: {
    overflow: 'auto',
    '@media (max-width: 768px)': {
      overflowX: 'auto'
    }
  },
};

export const loadingContainerStyles: IStackStyles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    backgroundColor: '#faf9f8',
  },
};

export const emptyStateStyles: IStackStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: '#faf9f8',
    minHeight: '300px',
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
