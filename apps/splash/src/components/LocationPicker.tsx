import { LocationService } from "@/services/location/locationService";
import { skipToken } from "@tanstack/react-query";
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

type LocationPickerProps = {
  organizationId?: string;
  onChange?: (location: string) => void;
  value: string;
  //   defaultValue?: string
} & Omit<
  ComboboxProps,
  "onValueChange" | "value" | "defaultValue" | "multiple"
>;
export function LocationPicker({
  organizationId,
  onChange,
  value,
  ...comboboxProps
}: LocationPickerProps) {
  const locationsResult = LocationService.useGetLocationsQuery(
    organizationId
      ? {
          organizationId,
        }
      : skipToken
  );

  return (
    <Combobox
      {...comboboxProps}
      value={value}
      onValueChange={onChange}
      data={
        locationsResult.data?.data.map((item) => ({
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
          {locationsResult.data?.data.map((loc) => (
            <ComboboxItem key={loc.id} value={loc.id.toString()}>
              {loc.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
