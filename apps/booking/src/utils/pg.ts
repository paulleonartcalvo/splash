import { sql } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import type { DrizzleDb } from "../plugins/drizzle";

type TxType = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
  any
>;

// Use this when making requests with a specific user context
export const withTenantContext = (
  db: DrizzleDb,
  userId: string | null,
  guestSessionId?: string
) => {
  return async <R>(operation: (tx: TxType) => Promise<R>): Promise<R> => {
    return await db.transaction(async (tx) => {
      if (userId) {
        await tx.execute(sql`SET LOCAL app.current_user_id = ${userId}`);
      }
      if (guestSessionId) {
        await tx.execute(
          sql`SET LOCAL app.current_guest_session_id = ${guestSessionId}`
        );
      }
      return await operation(tx);
    });
  };
};
