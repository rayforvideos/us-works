import { type ComponentProps } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PUBLISHED_CONTENT_FIXTURE } from "@/entities/content";
import { SENT_NOTIFICATION_FIXTURE } from "@/entities/notification";

import { PublishOptionsDialog } from ".";

function renderDialog(props: Partial<ComponentProps<typeof PublishOptionsDialog>> = {}) {
  const onSubmit = vi.fn();
  const onOpenChange = vi.fn();

  render(
    <PublishOptionsDialog
      open
      onOpenChange={onOpenChange}
      content={null}
      notification={null}
      contentTitle="콘텐츠 제목"
      submitting={false}
      onSubmit={onSubmit}
      {...props}
    />,
  );

  return { onSubmit, onOpenChange };
}

function pickRadio(name: string) {
  fireEvent.click(screen.getByRole("radio", { name }));
}

function publish() {
  fireEvent.click(screen.getByRole("button", { name: /발행하기/ }));
}

function getPublishedAtField(): HTMLElement {
  return screen.getByLabelText("예약 발행", { selector: "input[type='datetime-local']" });
}

describe("PublishOptionsDialog", () => {
  it("S-02 Given 모달에서 비공개를 고르면 When 알람 설정을 보면 Then 발송 여부가 미발송으로 비활성이고 대상자·알람 내용이 없다", () => {
    renderDialog();

    pickRadio("비공개");

    expect(screen.getByRole("radio", { name: "미발송" })).toBeChecked();
    expect(screen.queryByRole("radio", { name: "전체" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("알람 내용")).not.toBeInTheDocument();
  });

  it('S-03 Given 예약 발행을 고른 모달 When 시각을 비운 채 발행하기를 누르면 Then "필수 정보입니다."가 보이고 요청을 보내지 않는다', async () => {
    const { onSubmit } = renderDialog();

    pickRadio("예약 발행");
    publish();

    expect(await screen.findByText("필수 정보입니다.")).toBeInTheDocument();
    expect(getPublishedAtField()).toHaveAccessibleDescription("필수 정보입니다.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('S-04 Given 발송을 고른 모달 When 알람 내용을 비운 채 발행하기를 누르면 Then "알람 내용을 입력해주세요."가 보이고 요청을 보내지 않는다', async () => {
    const { onSubmit } = renderDialog();

    publish();

    expect(await screen.findByText("알람 내용을 입력해주세요.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("S-05 Given 발송을 고른 모달 When 콘텐츠 제목 사용을 체크하면 Then 알람 내용에 콘텐츠 제목이 채워지고 입력이 비활성이 된다", () => {
    renderDialog();

    fireEvent.click(screen.getByRole("checkbox", { name: "콘텐츠 제목 사용" }));

    expect(screen.getByLabelText("알람 내용")).toHaveValue("콘텐츠 제목");
    expect(screen.getByLabelText("알람 내용")).toBeDisabled();
  });

  it("R-04 비공개를 고르면 발송 여부는 미발송이 되고 바꿀 수 없다", () => {
    renderDialog();

    pickRadio("비공개");

    expect(screen.getByRole("radio", { name: "미발송" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "발송" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "미발송" })).toBeDisabled();
  });

  it("기본값은 공개·발송·전체이고 알람 내용은 비어 있다", () => {
    renderDialog();

    expect(screen.getByRole("radio", { name: "공개" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "발송" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "전체" })).toBeChecked();
    expect(screen.getByLabelText("알람 내용")).toHaveValue("");
  });

  it("유효한 값으로 발행하기를 누르면 폼 값을 그대로 넘긴다", async () => {
    const { onSubmit } = renderDialog();

    fireEvent.change(screen.getByLabelText("알람 내용"), { target: { value: "알람 내용" } });
    publish();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        visibility: "public",
        publishedAt: "",
        notify: true,
        targetType: "all",
        useContentTitle: false,
        notificationTitle: "알람 내용",
      });
    });
  });

  it("취소를 누르면 모달을 닫는다", () => {
    const { onOpenChange } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("제출 중이면 발행하기와 취소를 누를 수 없다", () => {
    renderDialog({ submitting: true });

    expect(screen.getByRole("button", { name: /발행하기/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  });

  it("이미 발송된 알림이 있으면 알람 설정을 기존 값으로 보이되 모두 비활성이고 안내 문구를 보인다", () => {
    renderDialog({
      content: PUBLISHED_CONTENT_FIXTURE,
      notification: SENT_NOTIFICATION_FIXTURE,
    });

    expect(screen.getByText("이미 발송된 알림입니다.")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "발송" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "발송" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "전체" })).toBeDisabled();
    expect(screen.getByLabelText("알람 내용")).toHaveValue(SENT_NOTIFICATION_FIXTURE.title);
    expect(screen.getByLabelText("알람 내용")).toBeDisabled();
  });
});
