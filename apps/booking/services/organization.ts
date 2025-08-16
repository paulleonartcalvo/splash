import { eq } from 'drizzle-orm';
import { userOrganizations, organizations } from '../drizzle/schema';
import type { DrizzleDb } from '../plugins/drizzle';

export class OrganizationService {
  constructor(private db: DrizzleDb) {}

  async getUserOrganizations(userId: string) {
    const userOrgs = await this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        role: userOrganizations.role,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      })
      .from(userOrganizations)
      .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
      .where(eq(userOrganizations.userId, userId));

    return userOrgs;
  }
}