import { useEffect, type ReactNode } from 'react';
import {
  Panel,
  PanelType,
  Stack,
} from '@fluentui/react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  width?: number;
  children: ReactNode;
}

export const Drawer = ({
  isOpen,
  onClose,
  title,
  width = 600,
  children
}: DrawerProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Determinar el tipo de panel basado en el ancho
  const getPanelType = (): PanelType => {
    if (width <= 340) return PanelType.smallFixedNear;
    if (width <= 592) return PanelType.medium;
    if (width <= 644) return PanelType.large;
    return PanelType.extraLarge;
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onClose}
      type={getPanelType()}
      headerText={title}
      isLightDismiss={true}
      styles={{
        main: {
          width: `${width}px !important`,
        },
        content: {
          padding: 0,
        },
        scrollableContent: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        header: {
          borderBottom: '1px solid #edebe9',
        },
        headerText: {
          fontSize: '20px',
          fontWeight: 600,
          color: '#323130',
        },
      }}
    >
      <Stack
        styles={{
          root: {
            height: '100%',
            overflow: 'hidden',
          }
        }}
      >
        <Stack.Item
          grow
          styles={{
            root: {
              overflow: 'auto',
              padding: '24px',
            }
          }}
        >
          {children}
        </Stack.Item>
      </Stack>
    </Panel>
  );
};
