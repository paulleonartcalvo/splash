import { formatDateRange } from "little-date";
import { Button } from "./ui/button";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "./ui/shadcn-io/mini-calendar";

type CalendarEvent = {
  id: string;
  name: string;
  start: string;
  end: string;
  repeats: boolean;
};

type EventSlotProps = {
  event: CalendarEvent;
};
function EventSlot({ event }: EventSlotProps) {
  return (
    <div
      key={event.name}
      className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
    >
      <div className="font-medium">{event.name}</div>
      <div className="text-muted-foreground text-xs">
        {formatDateRange(new Date(event.start), new Date(event.end))}
      </div>
    </div>
  );
}

const testEvents: CalendarEvent[] = [
  {
    id: "1",
    name: "Morning Pool Session",
    start: "2025-08-18T09:00:00.000Z",
    end: "2025-08-18T14:00:00.000Z",
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
};
export function SessionsCard({ events = testEvents }: SessionsCardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Fixed Calendar Section */}
      <div className="flex-shrink-0 mb-2">
        <MiniCalendar>
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays className="flex-1 flex justify-between gap-2">
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
        <div className="flex flex-col gap-2">
          {events.map((e, index) => (
            <Button asChild key={`${e.id}-${index}`}>
              <EventSlot event={e} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
