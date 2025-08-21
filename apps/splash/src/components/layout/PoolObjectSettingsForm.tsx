import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import {
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from "../ui/shadcn-io/combobox";
import { OBJECT_TYPES, type PoolObject } from "./poolTypes";

const CircleShapeSettingsSchema = z.object({
  type: z.literal("circle"),
  radius: z.number(),
});

const RectangleShapeSettingsSchema = z.object({
  type: z.literal("rectangle"),
  rounded: z.boolean(),
});
const PoolObjectSchema = z.object({
  id: z.uuid(),
  typeId: z.uuid(),
  label: z.string().min(2).max(100),
  position: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
  }),
  rotation: z.number().min(0).max(360),
  size: z.union([
    z.object({
      width: z.number().min(0),
      height: z.number().min(0),
    }),
    z.literal("default"),
  ]),
  shapeSettings: z.discriminatedUnion("type", [
    RectangleShapeSettingsSchema,
    CircleShapeSettingsSchema,
  ]),
});

type Input = z.input<typeof PoolObjectSchema>;
type Output = z.output<typeof PoolObjectSchema>;

type PoolObjectSettingsFormProps = {
  value?: PoolObject;
//   objectTypes: PoolObjectType[];
  onSubmit?: (value: PoolObject) => void;
  formId?: string;
};

export function PoolObjectSettingsForm({
  value,
//   objectTypes,
  formId,
  onSubmit,
}: PoolObjectSettingsFormProps) {
  const form = useForm<Input | Output, unknown, Output>({
    mode: "all",
    values: value,
    defaultValues: {},
    resolver: zodResolver<Input | Output, unknown, Output>(PoolObjectSchema),
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
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Pool chair" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Combobox
                    clearable
                    {...field}
                    type="object type"
                    value={field.value}
                    onValueChange={field.onChange}
                    data={
                      Object.values(OBJECT_TYPES).map((d) => ({
                        label: d.name,
                        value: d.id,
                      })) ?? []
                    }
                  >
                    <ComboboxTrigger />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        { Object.values(OBJECT_TYPES).map((type) => (
                          <ComboboxItem key={type.id} value={type.id}>
                            {type.name}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
