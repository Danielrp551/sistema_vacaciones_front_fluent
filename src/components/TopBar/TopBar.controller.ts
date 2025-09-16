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

  // Función para generar iniciales del usuario
  const getUserInitials = (): string => {
    if (!user) return 'DT'; // Fallback por defecto
    
    // Si tenemos información de persona, usar nombres y apellido
    if (user.persona?.nombres && user.persona?.apellidoPaterno) {
      const nombres = user.persona.nombres.trim();
      const apellido = user.persona.apellidoPaterno.trim();
      
      const primeraInicial = nombres.charAt(0).toUpperCase();
      const segundaInicial = apellido.charAt(0).toUpperCase();
      
      return `${primeraInicial}${segundaInicial}`;
    }
    
    // Si no tenemos persona, usar userName
    if (user.userName) {
      const userName = user.userName.trim();
      if (userName.length >= 2) {
        return userName.substring(0, 2).toUpperCase();
      } else if (userName.length === 1) {
        return `${userName.toUpperCase()}U`; // U de Usuario
      }
    }
    
    // Fallback final
    return 'DT';
  };

  return {
    user,
    onMenuClick,
    onProfileClick,
    handleLogout,
    getUserInitials,
  };
};
