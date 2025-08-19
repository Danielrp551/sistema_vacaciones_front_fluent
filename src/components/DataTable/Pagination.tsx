import React from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Dropdown,
} from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  itemName?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 25, 50, 100],
  itemName = 'elementos',
  onPageChange,
  onPageSizeChange,
  className
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageSizeDropdownOptions: IDropdownOption[] = pageSizeOptions.map(size => ({
    key: size,
    text: size.toString()
  }));

  const handleFirstPage = () => onPageChange(1);
  const handlePreviousPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages);

  if (totalItems === 0) {
    return null;
  }

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      className={className}
      styles={{
        root: {
          padding: '16px 20px',
          borderTop: '1px solid #edebe9',
          backgroundColor: '#faf9f8',
        }
      }}
      tokens={{ childrenGap: 24 }}
      wrap
    >
      {/* Información y selector de tamaño de página */}
      <Stack horizontal tokens={{ childrenGap: 24 }} verticalAlign="center" wrap>
        <Text 
          styles={{ 
            root: { 
              fontSize: '14px', 
              color: '#605e5c', 
              fontWeight: '500',
              minWidth: '200px',
            } 
          }}
        >
          Mostrando {startItem}-{endItem} de {totalItems} {itemName}
        </Text>
        
        <Stack 
          horizontal 
          tokens={{ childrenGap: 8 }} 
          verticalAlign="center"
          styles={{
            root: {
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e1e5e9',
              minWidth: '160px',
            }
          }}
        >
          <Text styles={{ root: { fontSize: '14px', color: '#323130', fontWeight: '500' } }}>
            Mostrar
          </Text>
          <Dropdown
            options={pageSizeDropdownOptions}
            selectedKey={pageSize}
            onChange={(_, option) => {
              if (option) {
                onPageSizeChange(Number(option.key));
              }
            }}
            styles={{
              dropdown: { 
                width: 80,
                minWidth: 80,
              },
              title: { 
                fontSize: '14px', 
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontWeight: '500',
              },
              dropdownItem: { 
                fontSize: '14px',
                padding: '8px 12px',
              },
              dropdownItemSelected: {
                backgroundColor: '#0078d4',
                color: '#ffffff',
              },
              callout: {
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          />
          <Text styles={{ root: { fontSize: '14px', color: '#323130', fontWeight: '500' } }}>
            elementos
          </Text>
        </Stack>
      </Stack>

      {/* Controles de navegación */}
      {totalPages > 1 && (
        <Stack 
          horizontal 
          tokens={{ childrenGap: 4 }} 
          verticalAlign="center"
          styles={{
            root: {
              padding: '4px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e1e5e9',
            }
          }}
        >
          {/* Primera página */}
          <DefaultButton
            text="‹‹"
            title="Primera página"
            disabled={currentPage === 1}
            onClick={handleFirstPage}
            styles={{
              root: { 
                minWidth: '36px', 
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                margin: '2px',
                color: currentPage === 1 ? '#a19f9d' : '#0078d4',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              rootHovered: currentPage !== 1 ? {
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #0078d4',
                transform: 'translateY(-1px)',
              } : {
                backgroundColor: '#f8f9fa',
              },
              rootPressed: currentPage !== 1 ? {
                backgroundColor: '#f3f2f1',
                transform: 'translateY(0px)',
              } : {},
              rootDisabled: {
                backgroundColor: '#f8f9fa',
                color: '#a19f9d',
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          />
          
          {/* Página anterior */}
          <DefaultButton
            text="‹"
            title="Página anterior"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            styles={{
              root: { 
                minWidth: '36px', 
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                margin: '2px',
                color: currentPage === 1 ? '#a19f9d' : '#0078d4',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              rootHovered: currentPage !== 1 ? {
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #0078d4',
                transform: 'translateY(-1px)',
              } : {
                backgroundColor: '#f8f9fa',
              },
              rootPressed: currentPage !== 1 ? {
                backgroundColor: '#f3f2f1',
                transform: 'translateY(0px)',
              } : {},
              rootDisabled: {
                backgroundColor: '#f8f9fa',
                color: '#a19f9d',
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          />
          
          {/* Indicador de página actual */}
          <Stack 
            verticalAlign="center" 
            horizontalAlign="center"
            styles={{
              root: {
                minWidth: '120px',
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                margin: '2px',
              }
            }}
          >
            <Text 
              styles={{ 
                root: { 
                  fontSize: '14px', 
                  color: '#323130', 
                  fontWeight: '600',
                  textAlign: 'center',
                } 
              }}
            >
              {currentPage} de {totalPages}
            </Text>
          </Stack>
          
          {/* Página siguiente */}
          <DefaultButton
            text="›"
            title="Página siguiente"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            styles={{
              root: { 
                minWidth: '36px', 
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                margin: '2px',
                color: currentPage === totalPages ? '#a19f9d' : '#0078d4',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              rootHovered: currentPage !== totalPages ? {
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #0078d4',
                transform: 'translateY(-1px)',
              } : {
                backgroundColor: '#f8f9fa',
              },
              rootPressed: currentPage !== totalPages ? {
                backgroundColor: '#f3f2f1',
                transform: 'translateY(0px)',
              } : {},
              rootDisabled: {
                backgroundColor: '#f8f9fa',
                color: '#a19f9d',
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          />
          
          {/* Última página */}
          <DefaultButton
            text="››"
            title="Última página"
            disabled={currentPage === totalPages}
            onClick={handleLastPage}
            styles={{
              root: { 
                minWidth: '36px', 
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                margin: '2px',
                color: currentPage === totalPages ? '#a19f9d' : '#0078d4',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              rootHovered: currentPage !== totalPages ? {
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #0078d4',
                transform: 'translateY(-1px)',
              } : {
                backgroundColor: '#f8f9fa',
              },
              rootPressed: currentPage !== totalPages ? {
                backgroundColor: '#f3f2f1',
                transform: 'translateY(0px)',
              } : {},
              rootDisabled: {
                backgroundColor: '#f8f9fa',
                color: '#a19f9d',
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};
