import { type ComponentPropsWithRef, type ReactNode } from "react";

export type RadioGroupProps = Omit<ComponentPropsWithRef<"div">, "onChange" | "defaultValue"> & {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

export type RadioGroupItemProps = {
  value: string;
  label: ReactNode;
  subLabel?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  defaultValue: string | undefined;
  disabled: boolean;
  onValueChange: ((value: string) => void) | undefined;
};
