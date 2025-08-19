import { useState, useCallback } from 'react';

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface UseDataTableOptions {
  initialPageSize?: number;
  initialPage?: number;
}

export interface UseDataTableReturn {
  // Estado de paginación
  currentPage: number;
  pageSize: number;
  sortConfig: SortConfig | null;
  
  // Acciones de paginación
  changePage: (page: number) => void;
  changePageSize: (newPageSize: number) => void;
  handleSort: (columnKey: string, isSortedDescending?: boolean) => void;
  resetPagination: () => void;
}

export const useDataTable = ({
  initialPageSize = 10,
  initialPage = 1,
}: UseDataTableOptions = {}): UseDataTableReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleSort = useCallback((columnKey: string, isSortedDescending?: boolean) => {
    const direction = isSortedDescending ? 'descending' : 'ascending';
    setSortConfig({ key: columnKey, direction });
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setSortConfig(null);
  }, [initialPage, initialPageSize]);

  return {
    currentPage,
    pageSize,
    sortConfig,
    changePage,
    changePageSize,
    handleSort,
    resetPagination,
  };
};
