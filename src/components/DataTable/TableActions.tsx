import React from 'react';
import {
  IconButton,
  DefaultButton,
  Stack,
  TooltipHost,
} from '@fluentui/react';
import type { IIconProps, IButtonStyles } from '@fluentui/react';

export interface ActionButtonConfig {
  key: string;
  iconName: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  styles?: IButtonStyles;
  variant?: 'icon' | 'default';
}

export interface TableActionsProps<T = any> {
  item: T;
  actions: ActionButtonConfig[];
  menuActions?: ActionButtonConfig[];
  onMenuClick?: (event: React.MouseEvent<any>, item: T) => void;
  showMoreButton?: boolean;
  horizontal?: boolean;
}

export const TableActions = <T extends any>({
  item,
  actions = [],
  menuActions = [],
  onMenuClick,
  showMoreButton = true,
  horizontal = true,
}: TableActionsProps<T>) => {
  // Mostrar botones de acción directos
  const directActions = actions.slice(0, 2); // Máximo 2 acciones directas
  const hasMenuActions = menuActions.length > 0 || actions.length > 2;

  const renderAction = (action: ActionButtonConfig) => {
    const iconProps: IIconProps = { iconName: action.iconName };
    
    const button = action.variant === 'default' ? (
      <DefaultButton
        key={action.key}
        iconProps={iconProps}
        onClick={action.onClick}
        disabled={action.disabled}
        styles={{
          root: {
            minWidth: '32px',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            padding: 0,
          },
          ...action.styles,
        }}
      />
    ) : (
      <IconButton
        key={action.key}
        iconProps={iconProps}
        title={action.title}
        ariaLabel={action.title}
        onClick={action.onClick}
        disabled={action.disabled}
        styles={{
          root: {
            width: '32px',
            height: '32px',
            borderRadius: '4px',
          },
          rootHovered: {
            backgroundColor: '#f3f2f1',
          },
          ...action.styles,
        }}
      />
    );

    return (
      <TooltipHost key={action.key} content={action.title}>
        {button}
      </TooltipHost>
    );
  };

  if (!horizontal) {
    return (
      <Stack tokens={{ childrenGap: 4 }}>
        {directActions.map(renderAction)}
        {hasMenuActions && showMoreButton && onMenuClick && (
          <TooltipHost content="Más acciones">
            <IconButton
              iconProps={{ iconName: 'More' }}
              title="Más acciones"
              ariaLabel="Más acciones"
              onClick={(e) => onMenuClick(e, item)}
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                },
                rootHovered: {
                  backgroundColor: '#f3f2f1',
                },
              }}
            />
          </TooltipHost>
        )}
      </Stack>
    );
  }

  return (
    <Stack
      horizontal
      tokens={{ childrenGap: 4 }}
      verticalAlign="center"
      styles={{
        root: {
          display: 'flex',
          gap: '4px',
        },
      }}
    >
      {directActions.map(renderAction)}
      {hasMenuActions && showMoreButton && onMenuClick && (
        <TooltipHost content="Más acciones">
          <IconButton
            iconProps={{ iconName: 'More' }}
            title="Más acciones"
            ariaLabel="Más acciones"
            onClick={(e) => onMenuClick(e, item)}
            styles={{
              root: {
                width: '32px',
                height: '32px',
                borderRadius: '4px',
              },
              rootHovered: {
                backgroundColor: '#f3f2f1',
              },
            }}
          />
        </TooltipHost>
      )}
    </Stack>
  );
};
