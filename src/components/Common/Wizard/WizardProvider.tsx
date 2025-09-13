import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// TIPOS GENÉRICOS PARA WIZARD
// ============================================================================

export interface WizardStepConfig {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  isCompleted: boolean;
  isActive: boolean;
  canNavigate: boolean;
}

export interface WizardContextValue<T = any> {
  currentStep: number;
  totalSteps: number;
  data: T;
  steps: WizardStepConfig[];
  canGoNext: boolean;
  canGoBack: boolean;
  updateData: (updates: Partial<T>) => void;
  updateStep: (stepId: string, updates: Partial<WizardStepConfig>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  complete: () => void;
}

export interface WizardProviderProps<T> {
  children: ReactNode;
  initialData: T;
  initialSteps: WizardStepConfig[];
  onComplete?: (data: T) => void;
  onStepChange?: (step: number) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const WizardContext = createContext<WizardContextValue | null>(null);

export const useWizard = <T = any>(): WizardContextValue<T> => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard debe ser usado dentro de WizardProvider');
  }
  return context as WizardContextValue<T>;
};

// ============================================================================
// PROVIDER
// ============================================================================

export const WizardProvider = <T,>({
  children,
  initialData,
  initialSteps,
  onComplete,
  onStepChange
}: WizardProviderProps<T>) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<T>(initialData);
  const [steps, setSteps] = useState<WizardStepConfig[]>(initialSteps);

  const totalSteps = steps.length;
  const canGoNext = currentStep < totalSteps && steps[currentStep - 1]?.canNavigate;
  const canGoBack = currentStep > 1;

  const updateData = useCallback((updates: Partial<T>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStep = useCallback((stepId: string, updates: Partial<WizardStepConfig>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const updateStepsState = useCallback((newCurrentStep: number) => {
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      isActive: index + 1 === newCurrentStep,
      isCompleted: index + 1 < newCurrentStep
    })));
  }, []);

  const nextStep = useCallback(() => {
    if (canGoNext) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateStepsState(newStep);
      onStepChange?.(newStep);
    }
  }, [currentStep, canGoNext, updateStepsState, onStepChange]);

  const prevStep = useCallback(() => {
    if (canGoBack) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      updateStepsState(newStep);
      onStepChange?.(newStep);
    }
  }, [currentStep, canGoBack, updateStepsState, onStepChange]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      updateStepsState(step);
      onStepChange?.(step);
    }
  }, [totalSteps, updateStepsState, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
    setSteps(initialSteps);
    updateStepsState(1);
    onStepChange?.(1);
  }, [initialData, initialSteps, updateStepsState, onStepChange]);

  const complete = useCallback(() => {
    onComplete?.(data);
  }, [data, onComplete]);

  const contextValue: WizardContextValue<T> = {
    currentStep,
    totalSteps,
    data,
    steps,
    canGoNext,
    canGoBack,
    updateData,
    updateStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    complete
  };

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};
