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
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '140px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)',
    }
  },
};

export const statNumberStyles: ITextStyles = {
  root: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#323130',
    margin: '0 0 8px 0',
    lineHeight: '1.2',
  },
};

export const statLabelStyles: ITextStyles = {
  root: {
    fontSize: '13px',
    color: '#605e5c',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
};

export const tableContainerStyles: IStackStyles = {
  root: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #edebe9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
};

export const sectionTitleStyles: ITextStyles = {
  root: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#323130',
    margin: '0 0 16px 0',
  },
};
