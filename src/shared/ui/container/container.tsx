import { type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { containerClass } from "./container-variants";

/**
 * @types
 */
type ContainerElement = "div" | "section" | "main";

type ContainerProps = {
  as?: ContainerElement;
  className?: string;
  children: ReactNode;
};

export function Container({ as = "div", className, children }: ContainerProps) {
  const Element = as;

  return <Element className={cn(containerClass(), className)}>{children}</Element>;
}
