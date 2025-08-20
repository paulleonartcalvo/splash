import { useAbility } from '@/contexts/AbilityContext';
import { type ReactNode } from 'react';
import type { Actions, Subjects } from '@/lib/ability';

// Re-export CASL Can component with our ability
export function Can({ 
  I: action, 
  a: subject, 
  field,
  children,
  fallback = null 
}: {
  I: Actions;
  a: Subjects;
  field?: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { ability } = useAbility();
  
  // Use conditional rendering instead of CASLCan fallback
  if (ability.can(action, subject, field)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

// Hook for conditional rendering
export function useCanRender(action: Actions, subject: Subjects, field?: string): boolean {
  const { ability } = useAbility();
  return ability.can(action, subject, field);
}

export function useCannotRender(action: Actions, subject: Subjects, field?: string): boolean {
  const { ability } = useAbility();
  return ability.cannot(action, subject, field);
}