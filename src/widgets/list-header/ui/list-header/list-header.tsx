import { type ReactNode } from "react";
import { NavLink } from "react-router";

import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { LogoIcon } from "@/shared/ui/icon";

import {
  actionsClass,
  containerClass,
  logoButtonClass,
  tabActiveClass,
  tabListClass,
} from "./list-header-variants";

/**
 * @types
 */
type ListHeaderProps = {
  action?: ReactNode;
};

/**
 * @constants
 */
const TABS = [
  { to: "/", label: "콘텐츠", end: true },
  { to: "/alarms", label: "알람", end: false },
];

export function ListHeader({ action }: ListHeaderProps) {
  return (
    <header>
      <Container className={containerClass()}>
        <button
          type="button"
          aria-label="맨 위로"
          className={logoButtonClass()}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <LogoIcon />
        </button>
        <nav aria-label="주요 메뉴">
          <ul className={tabListClass()}>
            {TABS.map((tab) => (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={tab.end}
                  className={cn(buttonVariants({ variant: "text" }), tabActiveClass())}
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {action ? <div className={actionsClass()}>{action}</div> : null}
      </Container>
    </header>
  );
}
