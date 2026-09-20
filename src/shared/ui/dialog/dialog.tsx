import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { cn } from "@/shared/lib/cn";
import { CancelIcon } from "@/shared/ui/icon";

import {
  backdropClass,
  bodyClass,
  closeClass,
  headerClass,
  popupClass,
  titleClass,
} from "./dialog-variants";
import { type DialogProps } from "./types";

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
  finalFocus,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
      }}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropClass()} />
        <BaseDialog.Popup finalFocus={finalFocus} className={cn(popupClass(), className)}>
          <div className={headerClass()}>
            <BaseDialog.Title className={titleClass()}>{title}</BaseDialog.Title>
            <BaseDialog.Close aria-label="닫기" className={closeClass()}>
              <CancelIcon />
            </BaseDialog.Close>
          </div>
          <div className={bodyClass()}>{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
