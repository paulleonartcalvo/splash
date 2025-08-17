import { and, eq } from 'drizzle-orm';
import { locations, userLocations } from '../drizzle/schema';
import type { DrizzleDb } from '../plugins/drizzle';

export class LocationService {
  constructor(private db: DrizzleDb) {}

  async getLocations(userId: string, organizationId?: string) {
    // Build conditions conditionally
    const conditions = [eq(userLocations.userId, userId)];
    
    if (organizationId) {
      conditions.push(eq(locations.organizationId, organizationId));
    }

    const userLocs = await this.db
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
      .where(and(...conditions));

    return userLocs;
  }

  // Keep the original method for backward compatibility
  async getUserLocations(userId: string, organizationId?: string) {
    return this.getLocations(userId, organizationId);
  }
}