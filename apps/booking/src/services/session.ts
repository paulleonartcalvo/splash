import { and, eq, gte, lte } from 'drizzle-orm';
import { sessions, locations, userLocations, userSessions } from '../drizzle/schema';
import type { DrizzleDb } from '../plugins/drizzle';

export class SessionService {
  constructor(private db: DrizzleDb) {}

  async getSessions(userId: string, locationId?: string) {
    const conditions = [];
    
    if (locationId) {
      conditions.push(eq(sessions.locationId, locationId));
    }

    const userSess = await this.db
      .select({
        id: sessions.id,
        title: sessions.title,
        description: sessions.description,
        startDate: sessions.startDate,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        locationId: sessions.locationId,
        rrule: sessions.rrule,
        status: sessions.status,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
      })
      .from(sessions)
      .innerJoin(locations, eq(sessions.locationId, locations.id))
      .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
      .where(and(
        eq(userLocations.userId, userId),
        ...conditions
      ));

    return userSess;
  }

  async getSessionById(userId: string, sessionId: string) {
    const [result] = await this.db
      .select({
        id: sessions.id,
        title: sessions.title,
        description: sessions.description,
        startDate: sessions.startDate,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        locationId: sessions.locationId,
        rrule: sessions.rrule,
        status: sessions.status,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
      })
      .from(sessions)
      .innerJoin(locations, eq(sessions.locationId, locations.id))
      .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
      .where(
        and(
          eq(sessions.id, sessionId),
          eq(userLocations.userId, userId)
        )
      )
      .limit(1);

    return result || null;
  }

  async createSession({
    title,
    description,
    startDate,
    startTime,
    endTime,
    locationId,
    rrule,
    status = 'draft',
    userId,
  }: {
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endTime: string;
    locationId: string;
    rrule?: string;
    status?: 'draft' | 'active' | 'disabled';
    userId: string;
  }) {
    return await this.db.transaction(async (tx) => {
      // Verify user has access to the location
      const [userLocation] = await tx
        .select()
        .from(userLocations)
        .where(
          and(
            eq(userLocations.userId, userId),
            eq(userLocations.locationId, locationId)
          )
        )
        .limit(1);

      if (!userLocation) {
        throw new Error("You don't have access to this location");
      }

      // Create the session
      const [session] = await tx
        .insert(sessions)
        .values({
          title,
          description,
          startDate,
          startTime,
          endTime,
          locationId,
          rrule,
          status,
        })
        .returning();

      if (!session) {
        throw new Error("Failed to create session");
      }

      return session;
    });
  }

  async createReservation({
    sessionId,
    userId,
    instanceDatetime,
  }: {
    sessionId: string;
    userId: string;
    instanceDatetime: string;
  }) {
    return await this.db.transaction(async (tx) => {
      // Verify user has access to the session's location
      const [sessionLocation] = await tx
        .select({
          locationId: sessions.locationId,
        })
        .from(sessions)
        .innerJoin(locations, eq(sessions.locationId, locations.id))
        .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
        .where(
          and(
            eq(sessions.id, sessionId),
            eq(userLocations.userId, userId)
          )
        )
        .limit(1);

      if (!sessionLocation) {
        throw new Error("Session not found or you don't have access to it");
      }

      // Create the reservation
      const [reservation] = await tx
        .insert(userSessions)
        .values({
          sessionId,
          userId,
          instanceDatetime,
        })
        .returning();

      if (!reservation) {
        throw new Error("Failed to create reservation");
      }

      return reservation;
    });
  }

  async getUserReservations(userId: string, sessionId?: string) {
    const conditions = [eq(userSessions.userId, userId)];
    
    if (sessionId) {
      conditions.push(eq(userSessions.sessionId, sessionId));
    }

    const reservations = await this.db
      .select({
        id: userSessions.id,
        sessionId: userSessions.sessionId,
        userId: userSessions.userId,
        instanceDatetime: userSessions.instanceDatetime,
        createdAt: userSessions.createdAt,
        updatedAt: userSessions.updatedAt,
      })
      .from(userSessions)
      .where(and(...conditions));

    return reservations;
  }

  async findSessions({
    requestingUserId,
    filterUserId,
    locationId,
  }: {
    requestingUserId: string;
    filterUserId?: string;
    locationId?: string;
  }) {
    const conditions = [eq(userLocations.userId, requestingUserId)];
    
    if (locationId) {
      conditions.push(eq(sessions.locationId, locationId));
    }

    let query = this.db
      .select({
        id: sessions.id,
        title: sessions.title,
        description: sessions.description,
        startDate: sessions.startDate,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        locationId: sessions.locationId,
        rrule: sessions.rrule,
        status: sessions.status,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
      })
      .from(sessions)
      .innerJoin(locations, eq(sessions.locationId, locations.id))
      .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
      .where(and(...conditions));

    // If filtering by a specific user, join with userSessions to only show sessions they've booked
    if (filterUserId) {
      query = this.db
        .select({
          id: sessions.id,
          title: sessions.title,
          description: sessions.description,
          startDate: sessions.startDate,
          startTime: sessions.startTime,
          endTime: sessions.endTime,
          locationId: sessions.locationId,
          rrule: sessions.rrule,
          status: sessions.status,
          createdAt: sessions.createdAt,
          updatedAt: sessions.updatedAt,
        })
        .from(sessions)
        .innerJoin(locations, eq(sessions.locationId, locations.id))
        .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
        .innerJoin(userSessions, eq(sessions.id, userSessions.sessionId))
        .where(and(
          eq(userLocations.userId, requestingUserId),
          eq(userSessions.userId, filterUserId),
          ...(locationId ? [eq(sessions.locationId, locationId)] : [])
        ));
    }

    return await query;
  }

  async findSessionBookings({
    requestingUserId,
    filterUserId,
    locationId,
    instanceDateFrom,
    instanceDateTo,
  }: {
    requestingUserId: string;
    filterUserId?: string;
    locationId?: string;
    instanceDateFrom?: string;
    instanceDateTo?: string;
  }) {
    const conditions = [eq(userLocations.userId, requestingUserId)];
    
    if (filterUserId) {
      conditions.push(eq(userSessions.userId, filterUserId));
    }
    
    if (locationId) {
      conditions.push(eq(sessions.locationId, locationId));
    }
    
    if (instanceDateFrom) {
      conditions.push(gte(userSessions.instanceDatetime, instanceDateFrom));
    }
    
    if (instanceDateTo) {
      conditions.push(lte(userSessions.instanceDatetime, instanceDateTo));
    }

    const bookings = await this.db
      .select({
        id: userSessions.id,
        sessionId: userSessions.sessionId,
        userId: userSessions.userId,
        instanceDatetime: userSessions.instanceDatetime,
        createdAt: userSessions.createdAt,
        updatedAt: userSessions.updatedAt,
        session: {
          id: sessions.id,
          title: sessions.title,
          description: sessions.description,
          startDate: sessions.startDate,
          startTime: sessions.startTime,
          endTime: sessions.endTime,
          locationId: sessions.locationId,
          rrule: sessions.rrule,
          status: sessions.status,
        },
      })
      .from(userSessions)
      .innerJoin(sessions, eq(userSessions.sessionId, sessions.id))
      .innerJoin(locations, eq(sessions.locationId, locations.id))
      .innerJoin(userLocations, eq(locations.id, userLocations.locationId))
      .where(and(...conditions));

    return bookings;
  }
}