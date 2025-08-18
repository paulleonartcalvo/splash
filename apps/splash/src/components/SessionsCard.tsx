import { type CalendarEvent, EventSlot } from "./CalendarEventSlot";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "./ui/shadcn-io/mini-calendar";

const testEvents: CalendarEvent[] = [
  {
    id: "1",
    name: "Morning Pool Session",
    start: "2025-08-18T09:00:00.000Z",
    end: "2025-08-18T14:00:00.000Z",
    repeats: true,
    maxOccupancy: 150
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
            <EventSlot key={`${e.id}-${index}`} event={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
