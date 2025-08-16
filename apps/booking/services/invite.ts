import { eq, and } from 'drizzle-orm';
import { userInvites, organizations, locations, userOrganizations, userLocations } from "../drizzle/schema";
import type { DrizzleDb } from "../plugins/drizzle";

export class InviteService {
  constructor(private db: DrizzleDb) {}

  async generateInvite({
    invitedUserEmail,
    organizationId,
    locationId,
    createdBy,
  }: {
    invitedUserEmail: string;
    organizationId: string;
    locationId: number;
    createdBy: string;
  }) {
    const [invite] = await this.db
      .insert(userInvites)
      .values({
        invitedUserEmail,
        organizationId,
        locationId,
        createdBy,
      })
      .returning();

    if (!invite) {
      throw new Error("Failed to create invite");
    }

    return invite;
  }

  async getUserInvites(userEmail: string) {
    const invites = await this.db
      .select({
        id: userInvites.id,
        createdAt: userInvites.createdAt,
        invitedUserEmail: userInvites.invitedUserEmail,
        organizationId: userInvites.organizationId,
        organizationName: organizations.name,
        organizationSlug: organizations.slug,
        locationId: userInvites.locationId,
        locationName: locations.name,
        locationSlug: locations.slug,
      })
      .from(userInvites)
      .innerJoin(organizations, eq(userInvites.organizationId, organizations.id))
      .innerJoin(locations, eq(userInvites.locationId, locations.id))
      .where(eq(userInvites.invitedUserEmail, userEmail));

    return invites;
  }

  async consumeInvite(inviteId: number, userId: string, userEmail: string) {
    // Start transaction
    return await this.db.transaction(async (tx) => {
      // 1. Get the invite and verify it belongs to the user
      const [invite] = await tx
        .select()
        .from(userInvites)
        .where(
          and(
            eq(userInvites.id, inviteId),
            eq(userInvites.invitedUserEmail, userEmail)
          )
        )
        .limit(1);

      if (!invite) {
        throw new Error("Invite not found or not for this user");
      }

      // 2. Check if user is already in the organization
      const existingOrgMembership = await tx
        .select()
        .from(userOrganizations)
        .where(
          and(
            eq(userOrganizations.userId, userId),
            eq(userOrganizations.organizationId, invite.organizationId)
          )
        )
        .limit(1);

      // 3. Add user to organization if not already present
      if (existingOrgMembership.length === 0) {
        await tx.insert(userOrganizations).values({
          userId,
          organizationId: invite.organizationId,
          role: 'member',
        });
      }

      // 4. Check if user is already in the location
      const existingLocationMembership = await tx
        .select()
        .from(userLocations)
        .where(
          and(
            eq(userLocations.userId, userId),
            eq(userLocations.locationId, invite.locationId)
          )
        )
        .limit(1);

      // 5. Add user to location if not already present
      if (existingLocationMembership.length === 0) {
        await tx.insert(userLocations).values({
          userId,
          locationId: invite.locationId,
        });
      }

      // 6. Delete the invite (consume it)
      await tx.delete(userInvites).where(eq(userInvites.id, inviteId));

      return {
        organizationId: invite.organizationId,
        locationId: invite.locationId,
      };
    });
  }

  async rejectInvite(inviteId: number, userEmail: string) {
    // Verify invite belongs to the user and delete it
    const result = await this.db
      .delete(userInvites)
      .where(
        and(
          eq(userInvites.id, inviteId),
          eq(userInvites.invitedUserEmail, userEmail)
        )
      )
      .returning({ id: userInvites.id });

    if (result.length === 0) {
      throw new Error("Invite not found or not for this user");
    }

    return { inviteId };
  }
}
