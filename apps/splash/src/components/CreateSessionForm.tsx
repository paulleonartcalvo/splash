import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useCallback } from "react";
import {
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import { ALL_WEEKDAYS, Frequency } from "rrule";
import { toast } from "sonner";
import z from "zod";
import { DatePicker } from "./DatePicker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const CreateSessionFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.iso.date().refine((date) => dayjs(date).isAfter(dayjs()), {
      message: "Start date must be in the future",
    }), //TODO: Convert to UTC for all dates
    startTime: z.iso.time(),
    endTime: z.iso.time(),
    recurrence: z
      .object({
        frequency: z.literal(
          [
            Frequency.YEARLY,
            Frequency.MONTHLY,
            Frequency.WEEKLY,
            Frequency.DAILY,
          ],
          {
            error: "Invalid frequency",
          }
        ),
        interval: z.number().min(1, "Interval must be at least 1").optional(),
        byWeekDay: z.array(z.enum(ALL_WEEKDAYS)).optional(),
        byMonthDay: z.array(z.number().min(1).max(31)).optional(),
        byMonth: z.array(z.number().min(1).max(12)).optional(),
        until: z.iso.date().optional(),
      })
      .transform((recurrence) => {
        // Create RRULE string
      })
      .optional(),
  })
  .refine(
    ({ startTime, endTime }) => {
      const start = dayjs(startTime, "HH:mm");
      const end = dayjs(endTime, "HH:mm");
      return start.isBefore(end);
    },
    { error: "End time must be after start time" }
  );

type Input = z.input<typeof CreateSessionFormSchema>;
type Output = z.output<typeof CreateSessionFormSchema>;

type CreateSessionFormProps = {
  formId?: string;
  timezone: string;
  onSubmit?: (values: z.output<typeof CreateSessionFormSchema>) => void;
};

export function CreateSessionForm({
  formId,
  timezone,
  onSubmit,
}: CreateSessionFormProps) {
  const form = useForm<Input | Output, any, Output>({
    mode: "all",
    defaultValues: {},
    resolver: zodResolver<Input | Output, unknown, Output>(
      CreateSessionFormSchema
    ),
  });

  const handleSubmitValid: SubmitHandler<Output> = useCallback(
    (values) => {
      onSubmit?.(values);
    },
    [onSubmit]
  );

  const handleSubmitInvalid: SubmitErrorHandler<Input | Output> =
    useCallback(() => {
      toast.error("Please fix errors in the form");
    }, []);
  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmitValid, handleSubmitInvalid)}
    >
      <Form {...form}>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Morning pool session"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="A fun morning swim session" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.getValues().recurrence ? "Start date" : "Date"}
                </FormLabel>
                <FormControl>
                  <DatePicker
                    {...field}
                    value={dayjs(field.value).toDate()}
                    onChange={(date) => {
                      field.onChange(
                        date ? dayjs(date).format("YYYY-MM-DD") : undefined
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time-picker"
                    step="60"
                    {...field}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time-picker"
                    step="60"
                    {...field}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </form>
  );
}
