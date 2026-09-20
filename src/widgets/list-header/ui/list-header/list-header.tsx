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
import { type ListHeaderProps } from "./types";

export function ListHeader({ tabs, action }: ListHeaderProps) {
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
            {tabs.map((tab) => (
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
