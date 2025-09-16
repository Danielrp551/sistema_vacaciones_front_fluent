import { 
  Stack, 
  IconButton, 
  Text
} from '@fluentui/react';
import { useTopBarController } from './TopBar.controller';
import { styles } from './TopBar.styles';

const TopBar = () => {
  const { 
    onMenuClick, 
    onProfileClick,
    getUserInitials
  } = useTopBarController();

  return (
    <Stack styles={styles.root}>
      <Stack horizontal styles={styles.container} verticalAlign="center">
        {/* Botón de menú y título */}
        <Stack horizontal verticalAlign="center" styles={styles.leftSection}>
          <IconButton
            iconProps={{ iconName: 'GlobalNavButton' }}
            title="Menú"
            ariaLabel="Menú"
            onClick={onMenuClick}
            styles={styles.menuButton}
          />
          <Text variant="large" styles={styles.title}>
            Marsh McLennan
          </Text>
        </Stack>

        {/* Sección derecha con usuario */}
        <Stack horizontal verticalAlign="center" styles={styles.rightSection}>
          {/* Avatar del usuario */}
          <Stack styles={styles.avatar} verticalAlign="center" horizontalAlign="center">
            <Text styles={styles.avatarText}>{getUserInitials()}</Text>
          </Stack>
          
          {/* Icono de casa */}
          <IconButton
            iconProps={{ iconName: 'Home' }}
            title="Inicio"
            ariaLabel="Inicio"
            styles={styles.actionButton}
          />
          
          {/* Icono de cerrar sesión */}
          <IconButton
            iconProps={{ iconName: 'SignOut' }}
            title="Cerrar sesión"
            ariaLabel="Cerrar sesión"
            styles={styles.actionButton}
            onClick={onProfileClick}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopBar;
