import { type ComponentPropsWithRef, type ReactNode } from "react";

type ButtonImportance = "primary" | "secondary" | "assistive";

type SolidVariantProps = {
  variant?: "solid";
  importance?: ButtonImportance;
  size?: "large" | "medium";
};

type OutlineVariantProps = {
  variant: "outline";
  importance?: ButtonImportance;
  size?: "large" | "small";
};

type TextVariantProps = {
  variant: "text";
  importance?: "assistive";
  size?: never;
};

export type ButtonVariantProps = SolidVariantProps | OutlineVariantProps | TextVariantProps;

export type ButtonProps = ButtonVariantProps &
  Omit<ComponentPropsWithRef<"button">, "children"> & {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };
