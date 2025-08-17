import { convertToSlug } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { OrganizationPicker } from "./OrganizationPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./ui/shadcn-io/combobox";

const CreateLocationFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  slug: z.string().min(1),
  timezone: z.string().min(1),
  organizationId: z.string().min(1),
});

type CreateLocationFormType = z.infer<typeof CreateLocationFormSchema>;

type CreateLocationFormProps = {
  formId: string;
  defaultOrganization?: string;
  values?: CreateLocationFormType;
  onSubmit?: (values: CreateLocationFormType) => void;
};
export function CreateLocationForm({
  formId,
  values,
  defaultOrganization,
  onSubmit,
}: CreateLocationFormProps) {
  const form = useForm<CreateLocationFormType>({
    mode: "all",
    values,
    defaultValues: {
      name: "",
      slug: "",
      organizationId: defaultOrganization ?? "",
      address: "",
      timezone: "",
    },
    resolver: zodResolver(CreateLocationFormSchema),
  });

  const handleSubmitValid: SubmitHandler<CreateLocationFormType> = useCallback(
    (values) => {
      onSubmit?.(values);
    },
    [onSubmit]
  );

  const handleSubmitInvalid: SubmitErrorHandler<CreateLocationFormType> =
    useCallback(() => {
      toast.error("Please fix errors in the form");
    }, []);

  useEffect(() => {
    if (!form.getFieldState("organizationId").isDirty && defaultOrganization) {
      form.setValue("organizationId", defaultOrganization);
    }
  }, [defaultOrganization, form.getFieldState, form.setValue]);

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmitValid, handleSubmitInvalid)}
    >
      <Form {...form}>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <OrganizationPicker {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My location"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const slugState = form.getFieldState("slug");
                      if (!slugState.isDirty) {
                        form.setValue("slug", convertToSlug(e.target.value), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Waves Rd." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>timezone</FormLabel>

                <FormControl>
                  <Combobox
                    {...field}
                    clearable
                    type="timezone"
                    data={Intl.supportedValuesOf("timeZone").map((t) => ({
                      label: t,
                      value: t,
                    }))}
                    onValueChange={field.onChange}
                  >
                    <ComboboxTrigger />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxList>
                        <ComboboxEmpty />
                        {Intl.supportedValuesOf("timeZone").map((t) => (
                          <ComboboxItem key={t} value={t}>
                            {t}
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
