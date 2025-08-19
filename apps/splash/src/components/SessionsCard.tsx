import { SessionService } from "@/services/session/sessionService";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { datetime, RRule } from "rrule";
import { type CalendarEvent, EventSlot } from "./CalendarEventSlot";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "./ui/shadcn-io/mini-calendar";
import { Spinner } from "./ui/shadcn-io/spinner";

const testEvents: CalendarEvent[] = [
  {
    id: "1",
    name: "Morning Pool Session",
    start: "2025-08-18T09:00:00.000Z",
    end: "2025-08-18T14:00:00.000Z",
    repeats: true,
    maxOccupancy: 150,
  },
  {
    id: "2",
    name: "Afternoon Pool Session",
    start: "2025-08-18T14:30:00.000Z",
    end: "2025-08-18T20:00:00.000Z",
    repeats: true,
  },
  {
    id: "3",
    name: "Private Training",
    start: "2025-08-19T10:00:00.000Z",
    end: "2025-08-19T11:00:00.000Z",
    repeats: false,
  },
  {
    id: "4",
    name: "Weekend Open Swim",
    start: "2025-08-23T08:00:00.000Z",
    end: "2025-08-23T18:00:00.000Z",
    repeats: true,
  },
  {
    id: "5",
    name: "Water Aerobics",
    start: "2025-08-20T16:00:00.000Z",
    end: "2025-08-20T17:00:00.000Z",
    repeats: true,
  },
  {
    id: "2",
    name: "Afternoon Pool Session",
    start: "2025-08-18T14:30:00.000Z",
    end: "2025-08-18T20:00:00.000Z",
    repeats: true,
  },
  {
    id: "3",
    name: "Private Training",
    start: "2025-08-19T10:00:00.000Z",
    end: "2025-08-19T11:00:00.000Z",
    repeats: false,
  },
  {
    id: "4",
    name: "Weekend Open Swim",
    start: "2025-08-23T08:00:00.000Z",
    end: "2025-08-23T18:00:00.000Z",
    repeats: true,
  },
  {
    id: "5",
    name: "Water Aerobics",
    start: "2025-08-20T16:00:00.000Z",
    end: "2025-08-20T17:00:00.000Z",
    repeats: true,
  },
];

type SessionsCardProps = {
  events?: CalendarEvent[];
  locationId: string;
  timezone: string; // Timezone for the location
};
export function SessionsCard({ locationId, timezone }: SessionsCardProps) {
  const locationSessions = SessionService.useGetSessionsQuery({
    searchParams: {
      location_id: locationId,
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const generatedEvents = useMemo(() => {
    // Convert sessions with RRule to CalendarEvent format
    const calendarEvents: CalendarEvent[] = [];

    locationSessions.data?.data.forEach((session) => {
      if (!session.rrule) {
        // If no RRule, treat as a single event
        // Extract date and combine with times in location timezone
        const sessionDate = dayjs(session.startDate)
          .tz(timezone)
          .format("YYYY-MM-DD");
        const startLocal = dayjs.tz(
          `${sessionDate} ${session.startTime}`,
          timezone
        );
        const endLocal = dayjs.tz(
          `${sessionDate} ${session.endTime}`,
          timezone
        );

        calendarEvents.push({
          id: session.id,
          name: session.title,
          start: startLocal.toISOString(),
          end: endLocal.toISOString(),
          repeats: false,
          // maxOccupancy: session.maxOccupancy,
        });

        return;
      }

      // Parse the RRule string to generate recurring events
      const rule = RRule.fromString(session.rrule);

      console.log('DEBUG Session:', {
        sessionId: session.id,
        startDate: session.startDate,
        rrule: session.rrule,
        timezone,
        selectedDate,
      });

      // Convert selected date to the target timezone while preserving the calendar date
      // The true parameter prevents date shifting during timezone conversion
      const selectedInTimezone = dayjs(selectedDate).tz(timezone, true);
      const startOfDayLocal = selectedInTimezone.startOf('day');
      const endOfDayLocal = selectedInTimezone.endOf('day');
      
      // Convert to UTC for RRULE comparison
      const startOfDayUTC = startOfDayLocal.utc().toDate();
      const endOfDayUTC = endOfDayLocal.utc().toDate();
      
      const startOfDay = datetime(
        startOfDayUTC.getUTCFullYear(),
        startOfDayUTC.getUTCMonth() + 1,
        startOfDayUTC.getUTCDate(),
        startOfDayUTC.getUTCHours(),
        startOfDayUTC.getUTCMinutes(),
        startOfDayUTC.getUTCSeconds()
      );
      const endOfDay = datetime(
        endOfDayUTC.getUTCFullYear(),
        endOfDayUTC.getUTCMonth() + 1,
        endOfDayUTC.getUTCDate(),
        endOfDayUTC.getUTCHours(),
        endOfDayUTC.getUTCMinutes(),
        endOfDayUTC.getUTCSeconds()
      );

      console.log('DEBUG Date range:', {
        startOfDayLocal: startOfDayLocal.format(),
        endOfDayLocal: endOfDayLocal.format(),
        startOfDay,
        endOfDay
      });

      const dates = rule.between(startOfDay, endOfDay, true);

      console.log('DEBUG RRULE dates found:', dates);

      dates.forEach((ruleDate) => {
        // Create a date in the location's timezone using the rule date and session times
        const dateStr = dayjs(ruleDate).format("YYYY-MM-DD");

        // Combine the rule date with session start/end times in location timezone
        const startLocal = dayjs.tz(
          `${dateStr} ${session.startTime}`,
          timezone
        );
        const endLocal = dayjs.tz(`${dateStr} ${session.endTime}`, timezone);

        console.log('DEBUG Creating event:', {
          ruleDate,
          dateStr,
          startTime: session.startTime,
          endTime: session.endTime,
          startLocal: startLocal.format(),
          endLocal: endLocal.format(),
          startISO: startLocal.toISOString(),
          endISO: endLocal.toISOString()
        });

        calendarEvents.push({
          id: session.id,
          name: session.title,
          start: startLocal.toISOString(),
          end: endLocal.toISOString(),
          repeats: true,
          // maxOccupancy: session.maxOccupancy,
        });
      });
    });

    return calendarEvents;
  }, [locationSessions.data?.data, selectedDate]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Calendar Section */}
      <div className="flex-shrink-0 mb-2">
        <MiniCalendar
          onValueChange={(date) => {
            if (date) {
              console.log('Calendar date selected:', date);
              setSelectedDate(date);
            }
          }}
        >
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays className="flex-1 flex justify-between gap-2 overflow-auto">
            {(date) => (
              <MiniCalendarDay
                className="flex-1"
                date={date}
                key={date.toISOString()}
              />
            )}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
      </div>

      {/* Scrollable Events Section */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-2 items-center w-full">
          {locationSessions.isFetching ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            generatedEvents.map((e, index) => (
              <EventSlot
                key={`${e.id}-${index}`}
                event={e}
                timezone={timezone}
              />
            ))
          )}
          {generatedEvents.length === 0 && !locationSessions.isFetching && (
            <h4 className="text-sm text-muted-foreground p-2">
              No sessions available for this date.
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}
