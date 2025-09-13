import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

export interface DrawerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number;
  children: ReactNode;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const DrawerWizard = ({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 600,
  children
}: DrawerWizardProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div
        className="fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out"
        style={{ 
          width: `${width}px`,
          transform: isOpen ? 'translateX(0)' : `translateX(${width}px)`
        }}
      >
        <DrawerHeader 
          title={title} 
          subtitle={subtitle}
          onClose={onClose} 
        />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// HEADER DEL DRAWER
// ============================================================================

interface DrawerHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

const DrawerHeader = ({ title, subtitle, onClose }: DrawerHeaderProps) => (
  <div className="border-b border-gray-200 p-6 bg-white">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      
      <button
        onClick={onClose}
        className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Cerrar"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

// ============================================================================
// CONTENIDO SCROLLEABLE
// ============================================================================

export interface DrawerContentProps {
  children: ReactNode;
  className?: string;
}

export const DrawerContent = ({ children, className = '' }: DrawerContentProps) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>
    {children}
  </div>
);

// ============================================================================
// NAVEGACIÓN DEL DRAWER
// ============================================================================

export interface DrawerNavigationProps {
  canGoBack?: boolean;
  canGoNext?: boolean;
  canCancel?: boolean;
  nextLabel?: string;
  backLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const DrawerNavigation = ({
  canGoBack = false,
  canGoNext = false,
  canCancel = true,
  nextLabel = 'Siguiente',
  backLabel = 'Anterior',
  cancelLabel = 'Cancelar',
  loading = false,
  onNext,
  onBack,
  onCancel,
  className = ''
}: DrawerNavigationProps) => (
  <div className={`border-t border-gray-200 p-6 bg-white ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        {canCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {cancelLabel}
          </button>
        )}
      </div>
      
      <div className="flex gap-3">
        {canGoBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {backLabel}
          </button>
        )}
        
        {canGoNext && (
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              nextLabel
            )}
          </button>
        )}
      </div>
    </div>
  </div>
);
