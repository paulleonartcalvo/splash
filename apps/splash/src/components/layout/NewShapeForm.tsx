import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OBJECT_SHAPES } from "./poolTypes";

// Default shape settings map
const SHAPE_DEFAULTS = {
  rectangle: {
    type: "rectangle" as const,
    rounded: false,
    defaultWidth: 50,
    defaultHeight: 50,
  },
  circle: {
    type: "circle" as const,
    radius: 25,
  },
};

// Shape settings schemas
const RectangleSettingsSchema = z.object({
  type: z.literal("rectangle"),
  rounded: z.boolean(),
  defaultWidth: z.coerce.number().min(1, "Width must be positive"),
  defaultHeight: z.coerce.number().min(1, "Height must be positive"),
});

const CircleSettingsSchema = z.object({
  type: z.literal("circle"),
  radius: z.coerce.number().min(1, "Radius must be positive"),
});

const NewObjectTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  shapeSettings: z.discriminatedUnion("type", [
    RectangleSettingsSchema,
    CircleSettingsSchema,
  ]),
});

type NewObjectTypeFormType = z.infer<typeof NewObjectTypeFormSchema>;

type NewObjectTypeFormProps = {
  formId?: string;
  onSubmit?: (values: NewObjectTypeFormType) => void;
};

export function NewShapeForm({ formId, onSubmit }: NewObjectTypeFormProps) {
  const form = useForm<NewObjectTypeFormType>({
    mode: "all",
    defaultValues: {
      name: "",
      shapeSettings: SHAPE_DEFAULTS.rectangle,
    },
    resolver: zodResolver(NewObjectTypeFormSchema),
  });

  const watchedShapeSettings = form.watch("shapeSettings");

  const handleShapeChange = useCallback(
    (newShapeId: "rectangle" | "circle") => {
      form.setValue("shapeSettings", SHAPE_DEFAULTS[newShapeId]);
    },
    [form]
  );

  const handleSubmitValid: SubmitHandler<NewObjectTypeFormType> = useCallback(
    (values) => {
      onSubmit?.(values);
    },
    [onSubmit]
  );

  const handleSubmitInvalid: SubmitErrorHandler<NewObjectTypeFormType> =
    useCallback(() => {
      toast.error("Please fix errors in the form");
    }, []);

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmitValid, handleSubmitInvalid)}
      className="space-y-4"
    >
      <Form {...form}>
        <div className="grid gap-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pool Chair" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shape Selection */}
          <FormItem>
            <FormLabel>Shape</FormLabel>
            <Select
              onValueChange={(value) => {
                handleShapeChange(value as "rectangle" | "circle");
              }}
              defaultValue={watchedShapeSettings.type}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shape" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(OBJECT_SHAPES).map((shape) => (
                  <SelectItem key={shape.id} value={shape.id}>
                    {shape.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Rectangle-specific settings */}
          {watchedShapeSettings.type === "rectangle" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="shapeSettings.defaultWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shapeSettings.defaultHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Height</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="shapeSettings.rounded"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rounded corners</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Circle-specific settings */}
          {watchedShapeSettings.type === "circle" && (
            <FormField
              control={form.control}
              name="shapeSettings.radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Radius</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>
    </form>
  );
}
