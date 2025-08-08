import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext';

export const useTopBarController = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useLayout();

  const onMenuClick = () => {
    toggleSidebar();
  };

  const onProfileClick = () => {
    // Hacer logout cuando se hace clic en el icono de cerrar sesión
    logout();
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    onMenuClick,
    onProfileClick,
    handleLogout,
  };
};
