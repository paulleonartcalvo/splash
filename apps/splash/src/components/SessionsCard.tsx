import { SessionService } from "@/services/session/sessionService";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { RRule } from "rrule";
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
  onEventClick?: (event: CalendarEvent) => void; // Optional callback for event clicks
};
export function SessionsCard({ locationId, timezone, onEventClick }: SessionsCardProps) {
  const locationSessions = SessionService.useGetSessionsQuery({
    searchParams: {
      location_id: locationId,
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const generatedEvents = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];
    const selectedInTimezone = dayjs(selectedDate).tz(timezone, true);

    // Helper function to create event from session and date
    const createEvent = (session: any, eventDate: dayjs.Dayjs, repeats: boolean) => {
      const dateStr = eventDate.format("YYYY-MM-DD");
      const startLocal = dayjs.tz(`${dateStr} ${session.startTime}`, timezone);
      const endLocal = dayjs.tz(`${dateStr} ${session.endTime}`, timezone);

      return {
        id: session.id,
        name: session.title,
        start: startLocal.toISOString(),
        end: endLocal.toISOString(),
        repeats,
      };
    };

    locationSessions.data?.data.forEach((session) => {
      if (!session.rrule) {
        // Single event: use the session's start date
        const sessionDate = dayjs(session.startDate).tz(timezone);
        calendarEvents.push(createEvent(session, sessionDate, false));
        return;
      }

      // Recurring event: check if selected date has any occurrences
      const rule = RRule.fromString(session.rrule);
      
      // Check for any occurrences on the selected day (regardless of time)
      const startOfDay = selectedInTimezone.startOf('day').utc().toDate();
      const endOfDay = selectedInTimezone.endOf('day').utc().toDate();
      const occurrences = rule.between(startOfDay, endOfDay, true);
      
      if (occurrences.length > 0) {
        // Use the first occurrence to get the correct date
        const eventDate = dayjs(occurrences[0]);
        calendarEvents.push(createEvent(session, eventDate, true));
      }
    });

    return calendarEvents;
  }, [locationSessions.data?.data, selectedDate, timezone]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Calendar Section */}
      <div className="flex-shrink-0 mb-2">
        <MiniCalendar
          onValueChange={(date) => {
            if (date) {
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
                onClick={onEventClick}
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
