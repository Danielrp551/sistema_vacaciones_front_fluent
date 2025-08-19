import React from 'react';
import { Text } from '@fluentui/react';
import { getEstadoColor } from './tableHelpers';

export interface StatusBadgeProps {
  status: string;
  variant?: 'small' | 'medium' | 'large';
  customColor?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'small',
  customColor,
  className,
}) => {
  const color = customColor || getEstadoColor(status);
  
  const getFontSize = () => {
    switch (variant) {
      case 'large':
        return '13px';
      case 'medium':
        return '12px';
      case 'small':
      default:
        return '11px';
    }
  };

  const getPadding = () => {
    switch (variant) {
      case 'large':
        return '6px 12px';
      case 'medium':
        return '5px 10px';
      case 'small':
      default:
        return '4px 8px';
    }
  };

  const getMinWidth = () => {
    switch (variant) {
      case 'large':
        return '90px';
      case 'medium':
        return '80px';
      case 'small':
      default:
        return '70px';
    }
  };

  return (
    <Text
      variant="small"
      className={className}
      styles={{
        root: {
          backgroundColor: `${color}15`,
          color: color,
          padding: getPadding(),
          borderRadius: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
          textAlign: 'center',
          fontSize: getFontSize(),
          display: 'inline-block',
          minWidth: getMinWidth(),
          lineHeight: '1.2',
          whiteSpace: 'nowrap',
        },
      }}
    >
      {status}
    </Text>
  );
};
