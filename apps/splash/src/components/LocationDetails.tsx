import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Location } from "@/services/location/queries";
import { SessionService } from "@/services/session/sessionService";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { formatDateRange } from "little-date";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  TicketIcon,
  TrendingUpIcon,
} from "lucide-react";
import { RRule } from "rrule";
import { toast } from "sonner";
import { CreateSessionForm } from "./CreateSessionForm";
import { SessionsCard } from "./SessionsCard";
import { Status, StatusIndicator, StatusLabel } from "./ui/shadcn-io/status";

type LocationDetailsProps = {
  location: Location;
};

export function LocationDetails({ location }: LocationDetailsProps) {
  const createSessionMutation = SessionService.useCreateSessionMutation();

  const navigate = useNavigate({
    from: "/$organization/$location",
  });

  return (
    <div className="w-full h-full p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-bold text-foreground ">
              {location.name}
            </h1>
            <Status status="online">
              <StatusIndicator />
              <StatusLabel>Open</StatusLabel>
            </Status>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-scroll max-h-screen">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>
                  Create a new session at {location.name}
                </DialogDescription>
              </DialogHeader>
              <CreateSessionForm
                onSubmit={({ recurrence, ...rest }) => {
                  let rrule: string | undefined;

                  if (recurrence) {
                    rrule = new RRule({
                      freq: recurrence.frequency,
                      interval: recurrence.interval,
                      byweekday: recurrence.byWeekDay,
                      bymonthday: recurrence.byMonthDay,
                      bymonth: recurrence.byMonth,
                      // Make date from yyyy-mm-dd string
                      dtstart: dayjs(rest.startDate).toDate(),
                      until: recurrence.until
                        ? dayjs(recurrence.until).toDate()
                        : undefined,
                      tzid: location.timezone,
                    }).toString();
                  }

                  toast.promise(
                    createSessionMutation.mutateAsync({
                      body: {
                        ...rest,
                        locationId: location.id,
                        rrule,
                      },
                    }),
                    {
                      loading: "Creating session...",
                      success: "Session created successfully!",
                      error: "Failed to create session. Please try again.",
                    }
                  );
                }}
                timezone={location.timezone}
                formId="create-session-form"
              />
              <DialogFooter>
                <Button type="submit" form="create-session-form">
                  Create Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            {location.address}
          </p>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            {formatDateRange(
              new Date("2024-01-01T08:00:00"),
              new Date("2024-01-01T22:00:00")
            )}
          </div>
        </div>
      </div>

      {/* Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer max-h-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Sessions
            </CardTitle>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="max-h-80 overflow-hidden">
            <SessionsCard
              locationId={location.id}
              timezone={location.timezone}
              onEventClick={(event) => {

                console.log(event)
                navigate({
                  to: './book/$session/$occurrence',
                  params: {
                    session: event.sessionId,
                    occurrence: event.occurrenceId,
                  }
                })
              }}
            />
            {/* <CardDescription>Next session: Today at 2:00 PM</CardDescription> */}
          </CardContent>
        </Card>
        {/* My Upcoming Sessions */}

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              My Upcoming Sessions
            </CardTitle>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <CardDescription>Next session: Today at 2:00 PM</CardDescription>
          </CardContent>
        </Card>

        {/* Available Slots Today */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Available Today
            </CardTitle>
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <CardDescription>Open slots remaining today</CardDescription>
          </CardContent>
        </Card>

        {/* Remaining Credits/Sessions */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Remaining Credits
            </CardTitle>
            <TicketIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <CardDescription>Credits left this month</CardDescription>
          </CardContent>
        </Card>

        {/* Quick Book */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Quick Book</CardTitle>
            <PlusIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>Book your next session quickly</CardDescription>
            <div className="mt-3 space-y-1">
              <div className="text-sm text-muted-foreground">
                Next available:
              </div>
              <div className="text-sm font-medium">Today 3:00 PM - 4:00 PM</div>
            </div>
          </CardContent>
        </Card>

        {/* Location Hours */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Hours</CardTitle>
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">8:00 AM - 10:00 PM</div>
            <CardDescription>
              Open now • Closes at 10:00 PM ({location.timezone})
            </CardDescription>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Recent Activity
            </CardTitle>
            <TrendingUpIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <CardDescription>Sessions completed this week</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
