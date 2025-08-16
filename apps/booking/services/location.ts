import { eq, and } from 'drizzle-orm';
import { userLocations, locations, userOrganizations } from '../drizzle/schema';
import type { DrizzleDb } from '../plugins/drizzle';

export class LocationService {
  constructor(private db: DrizzleDb) {}

  async getUserLocations(userId: string, organizationId?: string) {
    let query = this.db
      .select({
        id: locations.id,
        name: locations.name,
        slug: locations.slug,
        address: locations.address,
        timezone: locations.timezone,
        organizationId: locations.organizationId,
        createdAt: locations.createdAt,
        updatedAt: locations.updatedAt,
      })
      .from(userLocations)
      .innerJoin(locations, eq(userLocations.locationId, locations.id))
      .where(eq(userLocations.userId, userId));

    // If organizationId is provided, filter by organization
    if (organizationId) {
      query = query.where(
        and(
          eq(userLocations.userId, userId),
          eq(locations.organizationId, organizationId)
        )
      );
    }

    const userLocs = await query;
    return userLocs;
  }
}