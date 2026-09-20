import { type ReactNode } from "react";

import { Logo } from "@/shared/ui/logo";

/**
 * @types
 */
type AuthFormLayoutProps = {
  children: ReactNode;
};

export function AuthFormLayout({ children }: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-4">
      <div className="flex items-center gap-5">
        <Logo />
        <h1 className="text-32-b700 text-blue-grey-300">US Alliance</h1>
      </div>
      <div className="flex w-full max-w-92.5 flex-col">{children}</div>
    </div>
  );
}
