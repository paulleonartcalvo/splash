import { convertToSlug } from "@/utils";
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
} from "./ui/form";
import { Input } from "./ui/input";

const CreateOrganizationFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

type CreateOrganizationFormType = z.infer<typeof CreateOrganizationFormSchema>;

type CreateOrganizationFormProps = {
  formId: string;
  values?: CreateOrganizationFormType;
  onSubmit?: (values: CreateOrganizationFormType) => void;
};
export function CreateOrganizationForm({
  formId,
  values,
  onSubmit,
}: CreateOrganizationFormProps) {
  const form = useForm<CreateOrganizationFormType>({
    mode: "all",
    values,
    defaultValues: {
      name: "",
      slug: "",
    },
    resolver: zodResolver(CreateOrganizationFormSchema),
  });

  const handleSubmitValid: SubmitHandler<CreateOrganizationFormType> =
    useCallback(
      (values) => {
        onSubmit?.(values);
      },
      [onSubmit]
    );

  const handleSubmitInvalid: SubmitErrorHandler<CreateOrganizationFormType> =
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My organization"
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
                <FormLabel>Organization slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-organization" {...field} />
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
