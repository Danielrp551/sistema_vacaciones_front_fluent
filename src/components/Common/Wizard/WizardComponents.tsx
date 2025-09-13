import { Stack, Text, Icon, PrimaryButton, DefaultButton, Spinner, SpinnerSize } from '@fluentui/react';
import type { ReactNode } from 'react';
import { useWizard, type WizardStepConfig } from '../Wizard/WizardProvider';

// ============================================================================
// INDICADOR DE PASOS VERTICAL
// ============================================================================

export interface StepIndicatorProps {
  className?: string;
}

export const StepIndicator = ({ className = '' }: StepIndicatorProps) => {
  const { steps, currentStep } = useWizard();

  return (
    <Stack 
      styles={{ 
        root: { 
          borderBottom: '1px solid #edebe9', 
          backgroundColor: '#faf9f8', 
          padding: '16px 24px' 
        } 
      }}
      className={className}
    >
      <Stack horizontal tokens={{ childrenGap: 32 }} styles={{ root: { overflowX: 'auto' } }}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = step.isCompleted;
          const isClickable = step.canNavigate;
          
          return (
            <StepItem
              key={step.id}
              step={step}
              stepNumber={stepNumber}
              isCurrent={isCurrent}
              isCompleted={isCompleted}
              isClickable={isClickable}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

// ============================================================================
// ITEM INDIVIDUAL DE PASO
// ============================================================================

interface StepItemProps {
  step: WizardStepConfig;
  stepNumber: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isClickable: boolean;
}

const StepItem = ({ 
  step, 
  stepNumber, 
  isCurrent, 
  isCompleted, 
  isClickable 
}: StepItemProps) => {
  const { goToStep } = useWizard();

  const handleClick = () => {
    if (isClickable && !isCurrent) {
      goToStep(stepNumber);
    }
  };

  const getTextColor = () => {
    if (isCurrent) return '#0078d4';
    if (isCompleted) return '#107c10';
    return '#605e5c';
  };

  const getCircleStyles = () => {
    if (isCurrent) {
      return {
        backgroundColor: '#0078d4',
        color: '#ffffff'
      };
    }
    if (isCompleted) {
      return {
        backgroundColor: '#107c10',
        color: '#ffffff'
      };
    }
    return {
      backgroundColor: '#c8c6c4',
      color: '#605e5c'
    };
  };

  const circleStyles = getCircleStyles();
  const textColor = getTextColor();

  return (
    <Stack verticalAlign="center">
      <DefaultButton
        onClick={handleClick}
        disabled={!isClickable || isCurrent}
        styles={{
          root: {
            border: 'none',
            background: 'transparent',
            padding: 0,
            minWidth: 'auto',
            height: 'auto',
            cursor: isClickable && !isCurrent ? 'pointer' : 'default'
          }
        }}
      >
        <Stack horizontalAlign="center" tokens={{ childrenGap: 12 }}>
          <Stack
            styles={{
              root: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: circleStyles.backgroundColor,
                color: circleStyles.color,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600' as const
              }
            }}
          >
            {isCompleted ? (
              <Icon iconName="Accept" styles={{ root: { fontSize: '16px' } }} />
            ) : (
              <Text styles={{ root: { color: circleStyles.color, fontSize: '14px', fontWeight: '600' as const } }}>
                {stepNumber}
              </Text>
            )}
          </Stack>
          
          <Stack horizontalAlign="center" styles={{ root: { minWidth: 0, maxWidth: '120px' } }}>
            <Text 
              styles={{ 
                root: { 
                  fontSize: '14px', 
                  fontWeight: '600' as const, 
                  color: textColor,
                  textAlign: 'center' as const,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                } 
              }}
            >
              {step.title}
            </Text>
            {step.description && (
              <Text 
                styles={{ 
                  root: { 
                    fontSize: '12px', 
                    color: '#605e5c',
                    textAlign: 'center' as const,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  } 
                }}
              >
                {step.description}
              </Text>
            )}
          </Stack>
        </Stack>
      </DefaultButton>
    </Stack>
  );
};

// ============================================================================
// WRAPPER PARA PASOS
// ============================================================================

export interface WizardStepProps {
  children: ReactNode;
  className?: string;
}

export const WizardStep = ({ children, className = '' }: WizardStepProps) => (
  <Stack styles={{ root: { padding: '24px' } }} className={className}>
    {children}
  </Stack>
);

// ============================================================================
// CONTROLES GENÉRICOS DEL WIZARD
// ============================================================================

export interface WizardControlsProps {
  nextLabel?: string;
  backLabel?: string;
  completeLabel?: string;
  loading?: boolean;
  customNext?: () => void;
  customBack?: () => void;
  customComplete?: () => void;
  hideNext?: boolean;
  hideBack?: boolean;
  className?: string;
}

export const WizardControls = ({
  nextLabel = 'Siguiente',
  backLabel = 'Anterior', 
  completeLabel = 'Completar',
  loading = false,
  customNext,
  customBack,
  customComplete,
  hideNext = false,
  hideBack = false,
  className = ''
}: WizardControlsProps) => {
  const { 
    canGoNext, 
    canGoBack, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep, 
    complete 
  } = useWizard();

  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (customNext) {
      customNext();
    } else if (isLastStep && customComplete) {
      customComplete();
    } else if (isLastStep) {
      complete();
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (customBack) {
      customBack();
    } else {
      prevStep();
    }
  };

  return (
    <Stack horizontal horizontalAlign="space-between" className={className}>
      <Stack>
        {canGoBack && !hideBack && (
          <DefaultButton
            text={backLabel}
            onClick={handleBack}
            disabled={loading}
          />
        )}
      </Stack>
      
      <Stack>
        {canGoNext && !hideNext && (
          <PrimaryButton
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <Spinner size={SpinnerSize.xSmall} />
                <Text>Procesando...</Text>
              </Stack>
            ) : (
              <Text>{isLastStep ? completeLabel : nextLabel}</Text>
            )}
          </PrimaryButton>
        )}
      </Stack>
    </Stack>
  );
};
