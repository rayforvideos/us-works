import { useBlocker, useNavigate } from "react-router";

import { ROUTES } from "@/shared/config";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { Container } from "@/shared/ui/container";
import { Gnb } from "@/widgets/gnb";

import { isLeaveAllowed } from "../../model/leave-confirm";
import { type AlarmWriteLayoutProps } from "./types";

export function AlarmWriteLayout({ isDirty, actions, children }: AlarmWriteLayoutProps) {
  const navigate = useNavigate();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      currentLocation.pathname !== nextLocation.pathname &&
      !isLeaveAllowed(nextLocation.state),
  );

  return (
    <>
      <Gnb
        title="알람발송"
        onBack={() => {
          void navigate(ROUTES.alarms, { viewTransition: true });
        }}
        actions={actions}
      />
      <Container as="main" className="py-19">
        {children}
      </Container>
      <ConfirmDialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open) {
            blocker.reset?.();
          }
        }}
        title="작성을 종료하시겠습니까?"
        description="작성 중인 글은 저장되지 않아요."
        cancelLabel="아니오"
        confirmLabel="네"
        onConfirm={() => {
          blocker.proceed?.();
        }}
      />
    </>
  );
}
