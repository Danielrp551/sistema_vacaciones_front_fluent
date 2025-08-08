import { 
  Stack,
  IconButton,
  Text
} from '@fluentui/react';
import { useSidebarController } from './Sidebar.controller';
import { styles } from './Sidebar.styles';

const Sidebar = () => {
  const { 
    navItems, 
    isCollapsed, 
    onLinkClick,
    expandedItems,
    toggleExpanded
  } = useSidebarController();

  const renderNavItem = (item: any) => {
    const isExpanded = expandedItems.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = window.location.pathname === item.url;

    return (
      <div key={item.key}>
        {/* Elemento principal */}
        <Stack 
          horizontal 
          verticalAlign="center" 
          styles={isSelected ? styles.navItemSelected : styles.navItem}
          onClick={() => hasChildren ? toggleExpanded(item.key) : onLinkClick(item)}
        >
          <IconButton
            iconProps={{ iconName: item.icon }}
            styles={styles.navIcon}
          />
          <Text styles={styles.navText}>{item.name}</Text>
          {hasChildren && (
            <IconButton
              iconProps={{ iconName: isExpanded ? 'ChevronUp' : 'ChevronDown' }}
              styles={styles.chevronIcon}
            />
          )}
        </Stack>

        {/* Subelementos */}
        {hasChildren && isExpanded && (
          <Stack styles={styles.subNavContainer}>
            {item.children.map((child: any) => (
              <Stack 
                key={child.key}
                horizontal 
                verticalAlign="center" 
                styles={window.location.pathname === child.url ? styles.subNavItemSelected : styles.subNavItem}
                onClick={() => onLinkClick(child)}
              >
                <IconButton
                  iconProps={{ iconName: child.icon }}
                  styles={styles.subNavIcon}
                />
                <Text styles={styles.subNavText}>{child.name}</Text>
              </Stack>
            ))}
          </Stack>
        )}
      </div>
    );
  };

  return (
    <Stack 
      styles={isCollapsed ? styles.rootCollapsed : styles.root}
      className={isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
    >
      {/* Navegación personalizada */}
      <Stack styles={styles.navContainer}>
        {navItems.map((item) => renderNavItem(item))}
      </Stack>
    </Stack>
  );
};

export default Sidebar;
