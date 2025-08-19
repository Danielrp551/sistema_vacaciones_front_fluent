# Componentes Reutilizables - DataTable

Este directorio contiene componentes reutilizables para tablas de datos con paginación, diseñados siguiendo las mejores prácticas de desarrollo frontend con React y TypeScript.

## Componentes

### DataTable
Componente principal que combina una tabla de datos con paginación.

**Props:**
- `items`: Array de datos a mostrar
- `columns`: Configuración de columnas de la tabla
- `isLoading`: Estado de carga (opcional)
- `emptyStateMessage`: Mensaje cuando no hay datos (opcional)
- `emptyStateTitle`: Título del estado vacío (opcional)
- `pagination`: Configuración de paginación (opcional)
- `selectionMode`: Modo de selección de filas (opcional)
- `layoutMode`: Modo de layout de la tabla (opcional)
- `onItemClick`: Callback al hacer click en un item (opcional)
- `onSort`: Callback para ordenamiento (opcional)

### Pagination
Componente de paginación reutilizable con controles de navegación y selector de tamaño de página.

**Props:**
- `currentPage`: Página actual
- `pageSize`: Tamaño de página actual
- `totalItems`: Total de elementos
- `pageSizeOptions`: Opciones de tamaño de página (opcional)
- `itemName`: Nombre de los elementos para mostrar (opcional)
- `onPageChange`: Callback al cambiar página
- `onPageSizeChange`: Callback al cambiar tamaño de página

### useDataTable
Hook personalizado para manejar el estado de paginación y ordenamiento.

**Retorna:**
- `currentPage`: Página actual
- `pageSize`: Tamaño de página
- `sortConfig`: Configuración de ordenamiento actual
- `changePage`: Función para cambiar página
- `changePageSize`: Función para cambiar tamaño de página
- `handleSort`: Función para manejar ordenamiento
- `resetPagination`: Función para resetear paginación

## Uso

### Ejemplo básico
```tsx
import { DataTable, useDataTable } from '../components/DataTable';

const MyComponent = () => {
  const {
    currentPage,
    pageSize,
    changePage,
    changePageSize,
    handleSort
  } = useDataTable();

  const columns = [
    {
      key: 'name',
      name: 'Nombre',
      fieldName: 'name',
      minWidth: 100,
      onRender: (item) => <Text>{item.name}</Text>
    }
  ];

  return (
    <DataTable
      items={data}
      columns={columns}
      pagination={{
        currentPage,
        pageSize,
        totalItems: totalData,
        onPageChange: changePage,
        onPageSizeChange: changePageSize
      }}
      onSort={handleSort}
    />
  );
};
```

## Características

- **Totalmente tipado**: Utiliza TypeScript para mayor seguridad de tipos
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Implementa mejores prácticas de accesibilidad
- **Personalizable**: Permite personalización de estilos y comportamiento
- **Reutilizable**: Diseñado para ser usado en múltiples páginas
- **Eficiente**: Manejo optimizado del estado y renderizado

## Dependencias

- @fluentui/react: Para componentes de UI
- React: Para la lógica de componentes
- TypeScript: Para tipado estático

## Implementado en

- **Dashboard**: Tabla de solicitudes de vacaciones del equipo
- **Gestión de Solicitudes**: Tabla principal (referencia original)

## Próximas mejoras

- Filtros integrados
- Exportación de datos
- Selección múltiple
- Configuración persistente de tamaño de página
- Ordenamiento por múltiples columnas
