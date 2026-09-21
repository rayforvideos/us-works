import { Link, NavLink } from "react-router";

import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { LogoIcon } from "@/shared/ui/icon";

import {
  actionsClass,
  containerClass,
  headerClass,
  logoLinkClass,
  tabActiveClass,
  tabListClass,
} from "./list-header-variants";
import { type ListHeaderProps } from "./types";

export function ListHeader({ homeTo, tabs, action }: ListHeaderProps) {
  return (
    <header className={headerClass()}>
      <Container className={containerClass()}>
        <Link
          to={homeTo}
          viewTransition
          aria-label="홈으로"
          className={logoLinkClass()}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <LogoIcon />
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className={tabListClass()}>
            {tabs.map((tab) => (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={tab.end}
                  viewTransition
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
