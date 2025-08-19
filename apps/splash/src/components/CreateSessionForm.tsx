import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { CheckIcon } from "lucide-react";
import { useCallback } from "react";
import {
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import {
    ALL_WEEKDAYS,
    Frequency,
    RRule,
    type ByWeekday,
    type WeekdayStr
} from "rrule";
import { toast } from "sonner";
import z from "zod";
import { DatePicker } from "./DatePicker";
import { Checkbox } from "./ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsTrigger,
    TagsValue,
} from "./ui/shadcn-io/tags";

dayjs.extend(utc)
dayjs.extend(timezone)

const allowedFrequencies = [
  RRule.DAILY,
  RRule.WEEKLY,
  RRule.MONTHLY,
  RRule.YEARLY,
] as const;

const frequencyLabels: Record<number, string> = {
  [RRule.YEARLY]: "Yearly",
  [RRule.MONTHLY]: "Monthly",
  [RRule.WEEKLY]: "Weekly",
  [RRule.DAILY]: "Daily",
};

const weekdayOptions: Record<
  WeekdayStr,
  { value: WeekdayStr; label: string; position: number }
> = {
  MO: { value: "MO", label: "Monday", position: 0 },
  TU: { value: "TU", label: "Tuesday", position: 1 },
  WE: { value: "WE", label: "Wednesday", position: 2 },
  TH: { value: "TH", label: "Thursday", position: 3 },
  FR: { value: "FR", label: "Friday", position: 4 },
  SA: { value: "SA", label: "Saturday", position: 5 },
  SU: { value: "SU", label: "Sunday", position: 6 },
};

const frequencySchema = z.literal(allowedFrequencies, {
  error: "Invalid frequency",
});
const CreateSessionFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.iso.datetime().refine((date) => dayjs(date).isAfter(dayjs()), {
      message: "Start date must be in the future",
    }), //TODO: Convert to UTC for all dates
    startTime: z.iso.time(),
    endTime: z.iso.time(),
    recurrence: z
      .object({
        frequency: z
          .string()
          .min(1)
          .pipe(z.coerce.number())
          .or(z.number())
          .pipe(frequencySchema),
        interval: z.number().min(1, "Interval must be at least 1").optional(),
        byWeekDay: z
          .array(z.enum(ALL_WEEKDAYS))
          .min(1)
          .optional()
          .transform((byWeekDay) => {
            if (!byWeekDay) return undefined;

            // Convert WeekdayStr values to RRule weekday instances
            const weekdayMap: Record<WeekdayStr, ByWeekday> = {
              MO: RRule.MO,
              TU: RRule.TU,
              WE: RRule.WE,
              TH: RRule.TH,
              FR: RRule.FR,
              SA: RRule.SA,
              SU: RRule.SU,
            };

            return byWeekDay?.map((day) => weekdayMap[day]);
          }),
        byMonthDay: z.array(z.number().min(1).max(31)).optional(),
        byMonth: z.array(z.number().min(1).max(12)).optional(),
        until: z.iso.date().optional(),
        timezone: z.string().optional(),
      })

      .nullish()
      .transform((v) => (v === null ? undefined : v)),
  })
  .refine(
    ({ startTime, endTime }) => {
      return startTime < endTime;
    },
    { error: "End time must be after start time", path: ["endTime"] }
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
  const form = useForm<Input, any, Output>({
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      startDate: dayjs().format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
    },
    resolver: zodResolver(CreateSessionFormSchema),
  });

  const handleSubmitValid: SubmitHandler<Output> = useCallback(
    (values) => {
      onSubmit?.(values);
      console.log(values);
    },
    [onSubmit]
  );

  const handleSubmitInvalid: SubmitErrorHandler<Input | Output> =
    useCallback(() => {
      toast.error("Please fix errors in the form");
    }, []);

  const watchedRecurrence = form.watch("recurrence");
  const hasRecurrence = Boolean(watchedRecurrence);

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
                      if (!date) {
                        // field.onChange(undefined);
                        return;
                      }
                      
                      // Create midnight in the location's timezone, convert to UTC
                      const dateStr = dayjs(date).format("YYYY-MM-DD");
                      const midnightInTimezone = dayjs.tz(`${dateStr}T00:00:00`, timezone);
                      field.onChange(midnightInTimezone.utc().toISOString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step="300"
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
                      step="300"
                      {...field}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="repeats"
              checked={hasRecurrence}
              onCheckedChange={(checked) => {
                if (checked) {
                  form.setValue("recurrence", {
                    frequency: Frequency.DAILY,
                    interval: 1,
                  });
                } else {
                  form.setValue("recurrence", null);
                }
              }}
            />
            <label
              htmlFor="repeats"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Repeats
            </label>
          </div>
          {hasRecurrence && (
            <>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="recurrence.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Frequencies</SelectLabel>
                              {allowedFrequencies.map((frequency) => (
                                <SelectItem
                                  key={frequency}
                                  value={frequency.toString()}
                                >
                                  {frequencyLabels[frequency]}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recurrence.interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="recurrence.byWeekDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekdays</FormLabel>
                    <FormControl>
                      <Tags>
                        <TagsTrigger>
                          {field.value
                            ?.sort(
                              (a, b) =>
                                weekdayOptions[a]?.position -
                                weekdayOptions[b]?.position
                            )
                            ?.map((tag) => (
                              <TagsValue
                                key={tag}
                                onRemove={() =>
                                  field.onChange(
                                    field.value?.filter((t) => t !== tag) ?? []
                                  )
                                }
                              >
                                {weekdayOptions[tag]?.label || tag}
                              </TagsValue>
                            ))}
                        </TagsTrigger>
                        <TagsContent>
                          <TagsInput placeholder="Search tag..." />
                          <ScrollArea></ScrollArea>
                          <TagsList>
                            <TagsEmpty />
                            <TagsGroup>
                              {Object.values(weekdayOptions)
                                .sort((a, b) => a.position - b.position)
                                .map((option) => (
                                  <TagsItem
                                    key={option.value}
                                    onSelect={() => {
                                      if (field.value?.includes(option.value)) {
                                        return field.onChange(
                                          field.value?.filter(
                                            (t) => t !== option.value
                                          ) ?? []
                                        );
                                      }

                                      field.onChange([
                                        ...(field.value ?? []),
                                        option.value,
                                      ]);
                                    }}
                                    value={option.value}
                                  >
                                    {option.label}
                                    {field.value?.includes(option.value) && (
                                      <CheckIcon
                                        className="text-muted-foreground"
                                        size={14}
                                      />
                                    )}
                                  </TagsItem>
                                ))}
                            </TagsGroup>
                          </TagsList>
                        </TagsContent>
                      </Tags>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </Form>
    </form>
  );
}
