import { cn } from "@/lib/utils";
import { formatDateRange } from "little-date";

export type CalendarEvent = {
  id: string;
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
  onClick?: (event: CalendarEvent) => void;
};
export function EventSlot({
  event,
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
    >
      <div className="font-medium">{event.name}</div>
      <div className="flex justify-between items-end">
        <div className="text-muted-foreground text-xs">
          {formatDateRange(new Date(event.start), new Date(event.end))}
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
