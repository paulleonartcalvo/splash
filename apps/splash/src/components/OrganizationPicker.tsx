import { OrganizationService } from "@/services/organization/organizationService";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  type ComboboxProps,
} from "./ui/shadcn-io/combobox";

type OrganizationPickerProps = {
  onChange?: (organization: string) => void;
  value: string;
  //   defaultValue?: string
} & Omit<ComboboxProps, "onValueChange" | "value" | "defaultValue" | "multiple" | "data" | "type">;
export function OrganizationPicker({
  onChange,
  value,
  ...comboboxProps
}: OrganizationPickerProps) {
  const organizationsResult = OrganizationService.useGetUserOrganizationsQuery();

  return (
    <Combobox
      {...comboboxProps}
      value={value}
      onValueChange={onChange}
      type="organization"
      data={
        organizationsResult.data?.data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        })) ?? []
      }
    >
      <ComboboxTrigger />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxList>
          <ComboboxEmpty />
          {organizationsResult.data?.data.map((org) => (
            <ComboboxItem key={org.id} value={org.id.toString()}>
              {org.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
