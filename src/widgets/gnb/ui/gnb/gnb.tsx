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
  titleTextClass,
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

type GnbLeadProps = Pick<GnbProps, "title" | "onBack">;

function GnbLead({ title, onBack }: GnbLeadProps) {
  if (!onBack) {
    return title ? (
      <h1 className={titleClass()}>
        <span className={titleTextClass()}>{title}</span>
      </h1>
    ) : null;
  }
  if (!title) {
    return (
      <button type="button" aria-label="뒤로 가기" onClick={onBack} className={backButtonClass()}>
        <ArrowLeftIcon />
      </button>
    );
  }
  return (
    <h1 className={titleClass()}>
      <button type="button" onClick={onBack} className={backButtonClass()}>
        <ArrowLeftIcon />
        <span className={titleTextClass()}>{title}</span>
      </button>
    </h1>
  );
}

export function Gnb({ title, message, onBack, actions, className }: GnbProps) {
  return (
    <header className={cn(gnbClass(), className)}>
      <Container className={containerClass()}>
        <div className={rowClass()}>
          <GnbLead title={title} onBack={onBack} />
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
