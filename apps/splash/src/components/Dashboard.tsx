import { Can, useCanRender } from "@/hooks/usePermissions";
import { useAbility } from "@/contexts/AbilityContext";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  // Example of using permission hooks
  const canCreateOrg = useCanRender('create', 'Organization');
  const { ability, loading } = useAbility();

  if (loading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      
      {/* Permission-based UI examples */}
      <div className="space-y-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Your Permissions</h3>
          <div className="space-y-2">
            <Can I="create" a="Organization" fallback={<p className="text-red-600">❌ Cannot create organizations</p>}>
              <p className="text-green-600">✅ Can create organizations</p>
            </Can>
            
            <Can I="manage" a="Location" fallback={<p className="text-red-600">❌ Cannot manage locations</p>}>
              <p className="text-green-600">✅ Can manage locations</p>
            </Can>
            
            <Can I="read" a="Session" fallback={<p className="text-red-600">❌ Cannot view sessions</p>}>
              <p className="text-green-600">✅ Can view sessions</p>
            </Can>
            
            <Can I="create" a="Reservation" fallback={<p className="text-red-600">❌ Cannot make reservations</p>}>
              <p className="text-green-600">✅ Can make reservations</p>
            </Can>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          <div className="flex gap-2">
            <Can I="create" a="Organization">
              <Button>Create Organization</Button>
            </Can>
            
            <Can I="create" a="Location">
              <Button variant="outline">Create Location</Button>
            </Can>
            
            <Can I="manage" a="User">
              <Button variant="secondary">Manage Users</Button>
            </Can>
          </div>
          
          {!canCreateOrg && (
            <p className="text-sm text-gray-500 mt-2">
              You need owner or admin permissions to create organizations
            </p>
          )}
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
          <p className="text-sm">Total permission rules: {ability.rules.length}</p>
        </div>
      </div>

      {/* 
      Original invite logic would go here when implemented:
      - Display user invites
      - Accept/reject invite functionality
      */}
    </div>
  );
}
