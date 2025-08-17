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

  async getLocationById(userId: string, locationId: number) {
    const [result] = await this.db
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
      .from(locations)
      .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
      .where(
        and(
          eq(locations.id, locationId),
          eq(userLocations.userId, userId)
        )
      )
      .limit(1);

    return result || null;
  }

  async createLocation({
    name,
    slug,
    address,
    timezone,
    organizationId,
    createdBy,
  }: {
    name: string;
    slug: string;
    address: string;
    timezone: string;
    organizationId: string;
    createdBy: string;
  }) {
    return await this.db.transaction(async (tx) => {
      // 1. Create the location
      const [location] = await tx
        .insert(locations)
        .values({
          name,
          slug,
          address,
          timezone,
          organizationId,
        })
        .returning();

      if (!location) {
        throw new Error("Failed to create location");
      }

      // 2. Add the creating user to the location
      await tx.insert(userLocations).values({
        userId: createdBy,
        locationId: location.id,
      });

      return location;
    });
  }

  // Keep the original method for backward compatibility
  async getUserLocations(userId: string, organizationId?: string) {
    return this.getLocations(userId, organizationId);
  }
}