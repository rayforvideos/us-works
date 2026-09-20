import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { Button } from "@/shared/ui/button";
import { backdropClass, closeClass, popupClass } from "@/shared/ui/dialog";
import { CancelIcon } from "@/shared/ui/icon";

import {
  actionsClass,
  bodyClass,
  closeRowClass,
  descriptionClass,
  titleClass,
} from "./confirm-dialog-variants";
import { type ConfirmDialogProps } from "./types";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
      }}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropClass()} />
        <BaseDialog.Popup className={popupClass({ width: "narrow" })}>
          <div className={closeRowClass()}>
            <BaseDialog.Close aria-label="닫기" className={closeClass()}>
              <CancelIcon />
            </BaseDialog.Close>
          </div>
          <div className={bodyClass()}>
            <BaseDialog.Title className={titleClass()}>{title}</BaseDialog.Title>
            <BaseDialog.Description className={descriptionClass()}>
              {description}
            </BaseDialog.Description>
          </div>
          <div className={actionsClass()}>
            <Button
              variant="outline"
              size="medium"
              fullWidth
              onClick={() => {
                onOpenChange(false);
              }}
            >
              {cancelLabel}
            </Button>
            <Button size="medium" fullWidth onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
