import { sql } from "drizzle-orm";
import { bigint, check, date, foreignKey, pgEnum, pgTable, text, time, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { authUsers as users } from 'drizzle-orm/supabase';

export const sessionStatusEnum = pgEnum("session_status_enum", ['draft', 'active', 'disabled'])


export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
});

export const userOrganizations = pgTable("user_organizations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_organizations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	organizationId: uuid("organization_id").notNull(),
	role: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "user_organizations_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_organizations_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("user_organizations_role_check", sql`role = ANY (ARRAY[('member'::character varying)::text, ('admin'::character varying)::text, ('owner'::character varying)::text])`),
]);

export const locations = pgTable("locations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	address: text().notNull(),
	timezone: text().notNull(),
	organizationId: uuid("organization_id").defaultRandom().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "locations_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("locations_org_slug_unique").on(table.slug, table.organizationId),
]);

export const sessions = pgTable("sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	description: text(),
	startDate: date("start_date").notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	locationId: uuid("location_id").notNull(),
	rrule: text(),
	status: sessionStatusEnum().default('draft').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "sessions_location_id_fkey"
		}),
]);

export const userSessions = pgTable("user_sessions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "user_sessions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	sessionId: uuid("session_id").notNull(),
	instanceDatetime: timestamp("instance_datetime", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [sessions.id],
			name: "user_sessions_session_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_sessions_user_id_fkey"
		}),
	unique("user_sessions_unique").on(table.userId, table.sessionId, table.instanceDatetime),
]);

export const userInvites = pgTable("user_invites", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_invites_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").default(sql`auth.uid()`).notNull(),
	invitedUserEmail: text("invited_user_email").notNull(),
	organizationId: uuid("organization_id").notNull(),
	locationId: uuid("location_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "user_invites_created_by_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "user_invites_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const roles = pgTable("roles", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
});

export const userLocations = pgTable("user_locations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_locations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	locationId: uuid("location_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "user_locations_location_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_locations_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("user_locations_user_loc_unique").on(table.userId, table.locationId),
]);
