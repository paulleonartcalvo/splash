import { eq } from "drizzle-orm";
import { userProfiles } from "../db/schema";
import type { DrizzleDb } from "../plugins/drizzle";

export class ProfileService {
  constructor(private db: DrizzleDb) {}

  async getUserProfile(userId: string) {
    const [profile] = await this.db
      .select({
        id: userProfiles.id,
        firstName: userProfiles.firstName,
        lastName: userProfiles.lastName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    return profile || null;
  }

  async updateUserProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    }
  ) {
    const [updated] = await this.db
      .update(userProfiles)
      .set({
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      })
      .where(eq(userProfiles.id, userId))
      .returning({
        id: userProfiles.id,
        firstName: userProfiles.firstName,
        lastName: userProfiles.lastName,
        avatarUrl: userProfiles.avatarUrl,
      });

    return updated || null;
  }
}
