import { useLayout } from '../../context/LayoutContext';

export const useLayoutController = () => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
};
