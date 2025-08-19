import { relations } from "drizzle-orm/relations";
import { authUsers as usersInAuth } from 'drizzle-orm/supabase';
import { locations, organizations, sessions, userInvites, userLocations, userOrganizations, userSessions } from "./schema";

export const userOrganizationsRelations = relations(userOrganizations, ({one}) => ({
	organization: one(organizations, {
		fields: [userOrganizations.organizationId],
		references: [organizations.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [userOrganizations.userId],
		references: [usersInAuth.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	userOrganizations: many(userOrganizations),
	locations: many(locations),
	userInvites: many(userInvites),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	userOrganizations: many(userOrganizations),
	userSessions: many(userSessions),
	userInvites: many(userInvites),
	userLocations: many(userLocations),
}));

export const locationsRelations = relations(locations, ({one, many}) => ({
	organization: one(organizations, {
		fields: [locations.organizationId],
		references: [organizations.id]
	}),
	sessions: many(sessions),
	userLocations: many(userLocations),
}));

export const sessionsRelations = relations(sessions, ({one, many}) => ({
	location: one(locations, {
		fields: [sessions.locationId],
		references: [locations.id]
	}),
	userSessions: many(userSessions),
}));

export const userSessionsRelations = relations(userSessions, ({one}) => ({
	session: one(sessions, {
		fields: [userSessions.sessionId],
		references: [sessions.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [userSessions.userId],
		references: [usersInAuth.id]
	}),
}));

export const userInvitesRelations = relations(userInvites, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userInvites.createdBy],
		references: [usersInAuth.id]
	}),
	organization: one(organizations, {
		fields: [userInvites.organizationId],
		references: [organizations.id]
	}),
}));

export const userLocationsRelations = relations(userLocations, ({one}) => ({
	location: one(locations, {
		fields: [userLocations.locationId],
		references: [locations.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [userLocations.userId],
		references: [usersInAuth.id]
	}),
}));