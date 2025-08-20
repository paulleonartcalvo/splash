import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CalendarEvent = {
  sessionId: string;
  occurrenceId: number;
  name: string;
  start: string;
  end: string;
  repeats: boolean;
  maxOccupancy?: number;
};

type EventSlotProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  event: CalendarEvent;
  timezone: string; // Location's timezone
  onClick?: (event: CalendarEvent) => void;
};
export function EventSlot({
  event,
  timezone,
  className,
  onClick,
  ...props
}: EventSlotProps) {
  const currOccupancy = 150;
  const isFullyBooked =
    !!event.maxOccupancy && currOccupancy >= event.maxOccupancy;

  return (
    <button
      {...props}
      disabled={isFullyBooked || !onClick}
      className={cn(
        "after:bg-primary/70 relative text-left bg-accent w-full rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full",
        isFullyBooked
          ? "opacity-50 cursor-not-allowed after:bg-muted-foreground/50"
          : onClick
            ? "hover:bg-muted transition-colors cursor-pointer hover:bg-accent/80"
            : undefined,
        className
      )}
      onClick={onClick ? () => onClick(event) : undefined}
    >
      <div className="font-medium">{event.name}</div>
      <div className="flex justify-between items-end">
        <div className="text-muted-foreground text-xs">
          {`${dayjs(event.start).tz(timezone).format("h:mm A")} - ${dayjs(event.end).tz(timezone).format("h:mm A")}`}
        </div>
        {event.maxOccupancy && (
          <div className="text-muted-foreground text-xs">
            {(event.maxOccupancy - currOccupancy).toLocaleString()} /{" "}
            {event.maxOccupancy.toLocaleString()}
          </div>
        )}
      </div>
    </button>
  );
}
