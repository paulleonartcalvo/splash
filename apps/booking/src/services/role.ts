import { eq } from "drizzle-orm";
import { roles } from "../db/schema";
import type { DrizzleDb } from "../plugins/drizzle";

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export class RoleService {
  constructor(private db: DrizzleDb) {}

  async getRoles(): Promise<Role[]> {
    const dbRoles = await this.db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles);

    return dbRoles.map(role => ({
      ...role,
      description: this.getDefaultDescription(role.id),
    }));
  }

  async getRoleById(roleId: string): Promise<Role | null> {
    const [role] = await this.db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!role) {
      return null;
    }

    return {
      ...role,
      description: this.getDefaultDescription(role.id),
    };
  }

  async isValidRole(roleId: string): Promise<boolean> {
    const role = await this.getRoleById(roleId);
    return role !== null;
  }

  private getDefaultDescription(roleId: string): string {
    const descriptions: Record<string, string> = {
      'member': 'Basic member access to organization resources',
      'admin': 'Administrative access with ability to manage members and settings',
      'owner': 'Full ownership access with ability to manage all aspects of the organization',
    };
    return descriptions[roleId] || 'Custom role';
  }
}