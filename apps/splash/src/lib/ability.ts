import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { MongoAbility } from '@casl/ability';

// Define actions
export type Actions = 'manage' | 'read' | 'create' | 'update' | 'delete';

// Define subjects (simplified approach)
export type Subjects = 
  | 'Organization'
  | 'Location' 
  | 'User'
  | 'Session'
  | 'Reservation'
  | 'all';

// Define the main ability type
export type AppAbility = MongoAbility<[Actions, Subjects]>;

// User organization data with role
export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'admin' | 'member';
}

// User location data
export interface UserLocation {
  id: string;
  name: string;
  organizationId: string;
}

// User permission data
export interface UserPermissions {
  userId: string;
  organizations: UserOrganization[];
  locations: UserLocation[];
}

// Create default ability for unauthenticated users
export function createUnauthenticatedAbility(): AppAbility {
  const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  
  // Unauthenticated users can only read public information
  // For now, let's be restrictive - they can't do anything
  
  return build();
}

// Create ability based on user permissions
export function createAuthenticatedAbility(permissions: UserPermissions): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  
  // Users can always read and update their own user data
  can('read', 'User');
  can('update', 'User');
  
  // For each organization, grant permissions based on role
  permissions.organizations.forEach(org => {
    switch (org.role) {
      case 'owner':
        // Owners can manage everything in their organization
        can('manage', 'Organization');
        can('manage', 'Location');
        can('manage', 'Session');
        can('manage', 'Reservation');
        break;
        
      case 'admin':
        // Admins can manage most things but not delete the organization
        can(['read', 'update'], 'Organization');
        can('manage', 'Location');
        can('manage', 'Session');
        can('manage', 'Reservation');
        break;
        
      case 'member':
        // Members can read organization info and manage their own reservations
        can('read', 'Organization');
        can('read', 'Location');
        can('read', 'Session');
        can(['create', 'read'], 'Reservation');
        can(['update', 'delete'], 'Reservation');
        break;
    }
  });
  
  // For locations user has access to, they can at least read
  permissions.locations.forEach(_location => {
    can('read', 'Location');
    can('read', 'Session');
  });
  
  return build();
}

// Default ability instance (will be replaced by context)
export const ability = createUnauthenticatedAbility();