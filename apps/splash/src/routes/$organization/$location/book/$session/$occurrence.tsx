import { PoolLayout } from "@/components/layout/PoolLayout";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RRule } from "rrule";

dayjs.extend(utc);
dayjs.extend(tz);

import z from "zod";

const paramsSchema = z.object({
  organization: z.string(),
  location: z.string(),
  session: z.string(),
  occurrence: z.coerce.number(),
});

export const Route = createFileRoute(
  "/$organization/$location/book/$session/$occurrence"
)({
  component: RouteComponent,
  params: {
    parse: (p) => paramsSchema.parse(p),
  },
  beforeLoad: ({ params, context }) => {
    const occurrenceUTC = dayjs.unix(params.occurrence).utc();

    // Check if occurrence is valid
    if (!occurrenceUTC.isValid()) {
      throw new Error("Invalid occurrence date");
    }

    const rrule = context.session.rrule;
    if (rrule) {
      // If the session has an RRULE, we need to check if the occurrence is part of the recurrence rule
      const rruleObj = RRule.fromString(rrule);
      const occurrences = rruleObj.between(
        occurrenceUTC.toDate(),
        occurrenceUTC.toDate(),
        true
      );

      if (occurrences.length === 0) {
        throw new Error(
          "This slot does not match any of this session's availability"
        );
      }

      // If the occurrence is part of the RRULE, we can proceed
      return;
    } else {
      // Session is a one off, so we can check if the occurrence matches the session startDate
      const sessionStartDate = dayjs(context.session.startDate).utc();

      if (sessionStartDate.isSame(occurrenceUTC)) {
        return;
      } else {
        throw new Error("This slot does not match any of this session's availability");
      }
    }
  },
});

function RouteComponent() {
  return (
    <div className="w-full h-full">
      <PoolLayout />
    </div>
  );
}
