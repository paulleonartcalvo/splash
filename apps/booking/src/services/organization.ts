import { and, eq } from "drizzle-orm";
import { organizations, userOrganizations } from "../db/schema";
import type { DrizzleDb } from "../plugins/drizzle";

export class OrganizationService {
  constructor(private db: DrizzleDb) {}

  async getUserOrganizations(userId: string, slug?: string) {
    // Build conditions conditionally
    const conditions = [eq(userOrganizations.userId, userId)];
    
    if (slug) {
      conditions.push(eq(organizations.slug, slug));
    }

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
      .innerJoin(
        organizations,
        eq(userOrganizations.organizationId, organizations.id)
      )
      .where(and(...conditions));

    return userOrgs;
  }

  async getOrganizationById(userId: string, organizationId: string) {
    const [result] = await this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        role: userOrganizations.role,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      })
      .from(organizations)
      .innerJoin(
        userOrganizations,
        eq(organizations.id, userOrganizations.organizationId)
      )
      .where(
        and(
          eq(organizations.id, organizationId),
          eq(userOrganizations.userId, userId)
        )
      )
      .limit(1);

    return result || null;
  }

  async createOrganization({
    name,
    slug,
    createdBy,
  }: {
    name: string;
    slug: string;
    createdBy: string;
  }) {
    return await this.db.transaction(async (tx) => {
      // 1. Create the organization
      const [organization] = await tx
        .insert(organizations)
        .values({
          name,
          slug,
        })
        .returning();

      if (!organization) {
        throw new Error("Failed to create organization");
      }

      // 2. Add the creating user as the owner of the organization
      await tx.insert(userOrganizations).values({
        userId: createdBy,
        organizationId: organization.id,
        role: "owner",
      })

      return organization;
    });
  }
}
