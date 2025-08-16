import { relations } from "drizzle-orm/relations";
import { organizations, userOrganizations, usersInAuth, userInvites, locations, userLocations } from "./schema";

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
	userInvites: many(userInvites),
	locations: many(locations),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	userOrganizations: many(userOrganizations),
	userInvites: many(userInvites),
	userLocations: many(userLocations),
}));

export const userInvitesRelations = relations(userInvites, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userInvites.createdBy],
		references: [usersInAuth.id]
	}),
	location: one(locations, {
		fields: [userInvites.locationId],
		references: [locations.id]
	}),
	organization: one(organizations, {
		fields: [userInvites.organizationId],
		references: [organizations.id]
	}),
}));

export const locationsRelations = relations(locations, ({one, many}) => ({
	userInvites: many(userInvites),
	organization: one(organizations, {
		fields: [locations.organizationId],
		references: [organizations.id]
	}),
	userLocations: many(userLocations),
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