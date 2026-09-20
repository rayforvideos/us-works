import { useState } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/config";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { Container } from "@/shared/ui/container";
import { Gnb } from "@/widgets/gnb";

import { type AlarmWriteLayoutProps } from "./types";

export function AlarmWriteLayout({ isDirty, actions, children }: AlarmWriteLayoutProps) {
  const navigate = useNavigate();
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  function leave() {
    void navigate(ROUTES.alarms);
  }

  return (
    <>
      <Gnb
        title="알람발송"
        onBack={() => {
          if (isDirty) {
            setIsLeaveOpen(true);
            return;
          }
          leave();
        }}
        actions={actions}
      />
      <Container as="main" className="py-19">
        {children}
      </Container>
      <ConfirmDialog
        open={isLeaveOpen}
        onOpenChange={setIsLeaveOpen}
        title="작성을 종료하시겠습니까?"
        description="작성 중인 글은 저장되지 않아요."
        cancelLabel="아니오"
        confirmLabel="네"
        onConfirm={leave}
      />
    </>
  );
}
