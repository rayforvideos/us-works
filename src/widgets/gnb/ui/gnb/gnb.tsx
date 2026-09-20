import { type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Container } from "@/shared/ui/container";
import { ArrowLeftIcon } from "@/shared/ui/icon";

import {
  actionsClass,
  backButtonClass,
  containerClass,
  gnbClass,
  messageClass,
  rowClass,
  titleClass,
} from "./gnb-variants";

/**
 * @types
 */
type GnbProps = {
  title?: string;
  message?: string;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
};

export function Gnb({ title, message, onBack, actions, className }: GnbProps) {
  return (
    <header className={cn(gnbClass(), className)}>
      <Container className={containerClass()}>
        <div className={rowClass()}>
          {onBack ? (
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={onBack}
              className={backButtonClass()}
            >
              <ArrowLeftIcon />
            </button>
          ) : null}
          {title ? <h1 className={titleClass()}>{title}</h1> : null}
          {message || actions ? (
            <div className={actionsClass()}>
              {message ? <p className={messageClass()}>{message}</p> : null}
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
