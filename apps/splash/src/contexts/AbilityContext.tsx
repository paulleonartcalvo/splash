import { useAuth } from '@/contexts/AuthContext';
import { getUserOrganizationsQueryOptions } from '@/services/organization/queries';
import { getLocationsQueryOptions } from '@/services/location/queries';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createUnauthenticatedAbility,
  createAuthenticatedAbility,
  type UserPermissions,
  type UserOrganization,
  type UserLocation,
} from '@/lib/ability';
import type { AppAbility } from '@/lib/ability';

interface AbilityContextType {
  ability: AppAbility;
  loading: boolean;
}

export const AbilityContext = createContext<AbilityContextType | undefined>(undefined);

interface AbilityProviderProps {
  children: ReactNode;
}

export function AbilityProvider({ children }: AbilityProviderProps) {
  const { session, loading: authLoading } = useAuth();

  // Fetch user organizations
  const {
    data: organizationsData,
    isLoading: organizationsLoading,
  } = useQuery({
    ...getUserOrganizationsQueryOptions({}),
    enabled: !!session?.user?.id,
  });

  // Fetch user locations
  const {
    data: locationsData,
    isLoading: locationsLoading,
  } = useQuery({
    ...getLocationsQueryOptions({}),
    enabled: !!session?.user?.id,
  });

  // Create ability based on current auth state and permissions
  const ability = useMemo(() => {
    // If still loading auth or no session, use unauthenticated ability
    if (authLoading || !session?.user?.id) {
      return createUnauthenticatedAbility();
    }

    // If user data is still loading, use unauthenticated ability for now
    if (organizationsLoading || locationsLoading) {
      return createUnauthenticatedAbility();
    }

    // If we have user data, create authenticated ability
    if (organizationsData?.data && locationsData?.data) {
      const permissions: UserPermissions = {
        userId: session.user.id,
        organizations: organizationsData.data.map((org): UserOrganization => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          role: org.role as 'owner' | 'admin' | 'member',
        })),
        locations: locationsData.data.map((loc): UserLocation => ({
          id: loc.id,
          name: loc.name,
          organizationId: loc.organizationId,
        })),
      };

      return createAuthenticatedAbility(permissions);
    }

    // Default to unauthenticated
    return createUnauthenticatedAbility();
  }, [
    session,
    authLoading,
    organizationsData,
    locationsData,
    organizationsLoading,
    locationsLoading,
  ]);

  // Determine if we're still loading permissions
  const loading = authLoading || 
    (!!session?.user?.id && (organizationsLoading || locationsLoading));

  return (
    <AbilityContext.Provider value={{ ability, loading }}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  return context;
}

// Convenience hook to check if user can perform an action
export function useCan() {
  const { ability } = useAbility();
  return ability.can.bind(ability);
}

// Convenience hook to check if user cannot perform an action  
export function useCannot() {
  const { ability } = useAbility();
  return ability.cannot.bind(ability);
}