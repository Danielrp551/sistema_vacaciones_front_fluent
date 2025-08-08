import { Stack } from '@fluentui/react';
import { styles } from './Layout.styles';
import TopBar from '../TopBar/TopBar';
import Sidebar from '../Sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // El estado del sidebar se maneja dentro del componente Sidebar

  return (
    <Stack styles={styles.root}>
      {/* Barra superior */}
      <TopBar />
      
      {/* Contenedor principal */}
      <Stack horizontal styles={styles.mainContainer}>
        {/* Barra lateral - siempre renderizada para las animaciones */}
        <Sidebar />
        
        {/* Contenido principal */}
        <Stack 
          grow 
          styles={styles.content}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Layout;
