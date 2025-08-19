import { LocationService } from "@/services/location/locationService";
import { OrganizationService } from "@/services/organization/organizationService";
import { RoleService } from "@/services/role/roleService";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@tanstack/react-query";
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./ui/shadcn-io/combobox";

const InviteUserFormSchema = z.object({
  email: z.email().min(1),
  organizationId: z.string().min(1),
  location: z.string().array().min(1),
  role: z.string().min(1),
});

type InviteUserFormType = z.infer<typeof InviteUserFormSchema>;
type Input = z.input<typeof InviteUserFormSchema>;
type Output = z.output<typeof InviteUserFormSchema>;

// type Output = z.input<typeof InviteUserFormSchema>
// type InviteUserFormType<IsInput extends boolean = false> = IsInput extends true
//   ? {
//       email: string;
//       organizationId: string | null;
//       location: string[];
//       role: number | string | null;
//     }
//   : {
//       email: string;
//       organizationId: string;
//       location: string[];
//       role: ;
//     };

type InviteUserFormProps = {
  formId: string;
  values?: InviteUserFormType;
  onSubmit?: (values: InviteUserFormType) => void;
  organization: string;
  location?: string;
};
export function InviteUserForm({
  formId,
  values,
  onSubmit,
  organization,
  location,
}: InviteUserFormProps) {
  const form = useForm<Input | Output, any, Output>({
    mode: "all",
    values,
    defaultValues: {
      email: "",
      organizationId: organization ?? "",
      location: location ? [location] : [],
      role: "",
    },
    resolver: zodResolver<Input | Output, unknown, Output>(
      InviteUserFormSchema
    ),
  });

  const organizationsResult = OrganizationService.useGetUserOrganizationsQuery(
    {}
  );

  const watchedOrganization = form.watch("organizationId");
  const locationsResult = LocationService.useGetLocationsQuery(
    watchedOrganization
      ? {
          searchParams: {
            organization_id: watchedOrganization,
          },
        }
      : skipToken
  );

  const rolesResult = RoleService.useGetRolesQuery();

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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User to invite</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Combobox
                    clearable
                    type="organization"
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      console.log(value);
                      field.onChange(value);
                      form.setValue("location", []);
                    }}
                    data={
                      organizationsResult.data?.data.map((d) => ({
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
                        {organizationsResult.data?.data.map((org) => (
                          <ComboboxItem key={org.id} value={org.id}>
                            {org.name}
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
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locations</FormLabel>
                <FormControl>
                  <Combobox
                    type="location"
                    multiple
                    value={field.value}
                    onValueChange={field.onChange}
                    data={
                      locationsResult.data?.data.map((d) => ({
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
                        {locationsResult.data?.data.map((location) => (
                          <ComboboxItem key={location.id} value={location.id}>
                            {location.name}
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

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Combobox
                    type="user's role"
                    value={field.value.toString()}
                    onValueChange={(v) => {
                      console.log(v);
                      field.onChange(v);
                    }}
                    data={
                      rolesResult.data?.data.map((d) => ({
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
                        {rolesResult.data?.data.map((role) => (
                          <ComboboxItem
                            key={role.id}
                            value={role.id.toString()}
                          >
                            {role.name}
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
