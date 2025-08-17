"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, XIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ComboboxData = {
  label: string;
  value: string;
};

type ComboboxContextType = {
  data: ComboboxData[];
  type: string;
  multiple: boolean;
  clearable: boolean;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width: number;
  setWidth: (width: number) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
};

const ComboboxContext = createContext<ComboboxContextType>({
  data: [],
  type: "item",
  multiple: false,
  clearable: false,
  value: "",
  onValueChange: () => {},
  open: false,
  onOpenChange: () => {},
  width: 200,
  setWidth: () => {},
  inputValue: "",
  setInputValue: () => {},
});

export type ComboboxProps = ComponentProps<typeof Popover> & {
  data: ComboboxData[];
  type: string;
  clearable?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & (
    | {
        multiple?: false;
        defaultValue?: string;
        value?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        multiple: true;
        defaultValue?: string[];
        value?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

export const Combobox = (props: ComboboxProps) => {
  if (props.multiple) {
    return <MultiCombobox {...props} />;
  }
  return <SingleCombobox {...props} />;
};

const SingleCombobox = ({
  data,
  type,
  clearable = false,
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: ComboboxProps & { multiple?: false }) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? "",
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange,
  });
  const [width, setWidth] = useState(200);
  const [inputValue, setInputValue] = useState("");

  return (
    <ComboboxContext.Provider
      value={{
        type,
        multiple: false,
        clearable,
        value,
        onValueChange: (newValue: string | string[]) => {
          if (typeof newValue === 'string') {
            onValueChange(newValue);
          }
        },
        open,
        onOpenChange,
        data,
        width,
        setWidth,
        inputValue,
        setInputValue,
      }}
    >
      <Popover {...props} onOpenChange={onOpenChange} open={open} />
    </ComboboxContext.Provider>
  );
};

const MultiCombobox = ({
  data,
  type,
  clearable = false,
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: ComboboxProps & { multiple: true }) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? [],
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange,
  });
  const [width, setWidth] = useState(200);
  const [inputValue, setInputValue] = useState("");

  return (
    <ComboboxContext.Provider
      value={{
        type,
        multiple: true,
        clearable,
        value,
        onValueChange: (newValue: string | string[]) => {
          if (Array.isArray(newValue)) {
            onValueChange(newValue);
          }
        },
        open,
        onOpenChange,
        data,
        width,
        setWidth,
        inputValue,
        setInputValue,
      }}
    >
      <Popover {...props} onOpenChange={onOpenChange} open={open} />
    </ComboboxContext.Provider>
  );
};

export type ComboboxTriggerProps = ComponentProps<typeof Button>;

export const ComboboxTrigger = ({
  children,
  ...props
}: ComboboxTriggerProps) => {
  const { value, data, type, multiple, clearable, onValueChange, setWidth } =
    useContext(ComboboxContext);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = (entry.target as HTMLElement).offsetWidth;
        if (newWidth) {
          setWidth?.(newWidth);
        }
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setWidth]);

  const selectedItems = multiple
    ? data.filter((item) => (value as string[]).includes(item.value))
    : [];

  const hasValue = multiple ? selectedItems.length > 0 : !!value;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onValueChange([]);
    } else {
      onValueChange("");
    }
  };

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        {...props}
        ref={ref}
        className={cn("min-h-10 justify-start", props.className)}
      >
        {children ??
          (multiple ? (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedItems.length === 0 ? (
                  <span className="text-muted-foreground">
                    Select {type}...
                  </span>
                ) : selectedItems.length <= 3 ? (
                  selectedItems.map((item) => (
                    <Badge
                      key={item.value}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.label}
                    </Badge>
                  ))
                ) : (
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedItems[0].label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      +{selectedItems.length - 1} more
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {clearable && hasValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={handleClear}
                    type="button"
                  >
                    <XIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                )}
                <ChevronsUpDownIcon
                  className="shrink-0 text-muted-foreground"
                  size={16}
                />
              </div>
            </div>
          ) : (
            <span className="flex w-full items-center justify-between gap-2">
              <span>
                {value
                  ? data.find((item) => item.value === value)?.label
                  : `Select ${type}...`}
              </span>
              <div className="flex items-center gap-1">
                {clearable && hasValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={handleClear}
                    type="button"
                  >
                    <XIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                )}
                <ChevronsUpDownIcon
                  className="shrink-0 text-muted-foreground"
                  size={16}
                />
              </div>
            </span>
          ))}
      </Button>
    </PopoverTrigger>
  );
};

export type ComboboxContentProps = ComponentProps<typeof Command> & {
  popoverOptions?: ComponentProps<typeof PopoverContent>;
};

export const ComboboxContent = ({
  className,
  popoverOptions,
  ...props
}: ComboboxContentProps) => {
  const { width } = useContext(ComboboxContext);

  return (
    <PopoverContent
      className={cn("p-0", className)}
      style={{ width }}
      {...popoverOptions}
    >
      <Command {...props} />
    </PopoverContent>
  );
};

export type ComboboxInputProps = ComponentProps<typeof CommandInput> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export const ComboboxInput = ({
  value: controlledValue,
  defaultValue,
  onValueChange: controlledOnValueChange,
  ...props
}: ComboboxInputProps) => {
  const { type, inputValue, setInputValue } = useContext(ComboboxContext);

  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? inputValue,
    prop: controlledValue,
    onChange: (newValue) => {
      // Sync with context state
      setInputValue(newValue);
      // Call external onChange if provided
      controlledOnValueChange?.(newValue);
    },
  });

  return (
    <CommandInput
      onValueChange={onValueChange}
      placeholder={`Search ${type}...`}
      value={value}
      {...props}
    />
  );
};

export type ComboboxListProps = ComponentProps<typeof CommandList>;

export const ComboboxList = (props: ComboboxListProps) => (
  <CommandList {...props} />
);

export type ComboboxEmptyProps = ComponentProps<typeof CommandEmpty>;

export const ComboboxEmpty = ({ children, ...props }: ComboboxEmptyProps) => {
  const { type } = useContext(ComboboxContext);

  return (
    <CommandEmpty {...props}>{children ?? `No ${type} found.`}</CommandEmpty>
  );
};

export type ComboboxGroupProps = ComponentProps<typeof CommandGroup>;

export const ComboboxGroup = (props: ComboboxGroupProps) => (
  <CommandGroup {...props} />
);

export type ComboboxItemProps = ComponentProps<typeof CommandItem> & {
  value: string;
};

export const ComboboxItem = ({
  value: itemValue,
  children,
  ...props
}: ComboboxItemProps) => {
  const { value, multiple, clearable, onValueChange, onOpenChange } =
    useContext(ComboboxContext);

  if (multiple) {
    const isSelected = (value as string[]).includes(itemValue);

    return (
      <CommandItem
        onSelect={() => {
          const currentValues = value as string[];
          const newValue = isSelected
            ? currentValues.filter((v) => v !== itemValue)
            : [...currentValues, itemValue];
          onValueChange(newValue);
        }}
        {...props}
      >
        <div className="flex items-center justify-between w-full">
          <span>{children}</span>
          <CheckIcon
            className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
          />
        </div>
      </CommandItem>
    );
  }

  const isSelected = value === itemValue;

  return (
    <CommandItem
      onSelect={() => {
        // If clearable and this item is already selected, clear the selection
        if (clearable && isSelected) {
          onValueChange("");
        } else {
          onValueChange(itemValue);
        }
        onOpenChange(false);
      }}
      {...props}
    >
      <span>{children}</span>
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

export type ComboboxSeparatorProps = ComponentProps<typeof CommandSeparator>;

export const ComboboxSeparator = (props: ComboboxSeparatorProps) => (
  <CommandSeparator {...props} />
);

export type ComboboxCreateNewProps = {
  onCreateNew: (value: string) => void;
  children?: (inputValue: string) => ReactNode;
  className?: string;
};

export const ComboboxCreateNew = ({
  onCreateNew,
  children,
  className,
}: ComboboxCreateNewProps) => {
  const { inputValue, type, multiple, value, onValueChange, onOpenChange } =
    useContext(ComboboxContext);

  if (!inputValue.trim()) {
    return null;
  }

  const handleCreateNew = () => {
    onCreateNew(inputValue.trim());

    if (multiple) {
      const currentValues = value as string[];
      onValueChange([...currentValues, inputValue.trim()]);
    } else {
      onValueChange(inputValue.trim());
      onOpenChange(false);
    }
  };

  return (
    <button
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={handleCreateNew}
      type="button"
    >
      {children ? (
        children(inputValue)
      ) : (
        <>
          <PlusIcon className="h-4 w-4 text-muted-foreground" />
          <span>
            Create new {type}: "{inputValue}"
          </span>
        </>
      )}
    </button>
  );
};

// Selected items display component for multi-select mode
export const ComboboxSelected = () => {
  const { value, data, multiple, onValueChange } = useContext(ComboboxContext);

  if (!multiple || (value as string[]).length === 0) return null;

  const selectedItems = data.filter((item) =>
    (value as string[]).includes(item.value)
  );

  const removeItem = (itemValue: string) => {
    const currentValues = value as string[];
    onValueChange(currentValues.filter((v) => v !== itemValue));
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b">
      {selectedItems.map((item) => (
        <Badge key={item.value} variant="secondary" className="text-xs">
          {item.label}
          <button
            onClick={(e) => {
              e.preventDefault();
              removeItem(item.value);
            }}
            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
