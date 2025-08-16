import { eq } from 'drizzle-orm';
import { userInvites, organizations, locations } from "../drizzle/schema";
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
}
