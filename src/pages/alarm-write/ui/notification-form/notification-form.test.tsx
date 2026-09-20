import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { type NotificationFormValues } from "../../model/notification-input-schema";
import { NOTIFICATION_FORM_ID, NotificationForm } from ".";

const EMPTY_VALUES: NotificationFormValues = {
  targetType: "all",
  title: "",
  scheduledAt: "",
};

function renderNotificationForm(defaultValues: NotificationFormValues = EMPTY_VALUES) {
  const onSubmit = vi.fn();

  render(
    <>
      <NotificationForm
        formId={NOTIFICATION_FORM_ID}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        disabled={false}
      />
      <button type="submit" form={NOTIFICATION_FORM_ID}>
        발송하기
      </button>
    </>,
  );

  return { onSubmit };
}

function submitForm() {
  fireEvent.click(screen.getByRole("button", { name: "발송하기" }));
}

function pickScheduledAt(value: string) {
  fireEvent.change(screen.getByLabelText("발송 시간"), { target: { value } });
}

describe("NotificationForm", () => {
  it('S-01 Given 빈 작성 폼 When 발송하기를 누르면 Then 제목과 시간에 "필수 정보입니다."가 보이고 요청을 보내지 않는다', () => {
    const { onSubmit } = renderNotificationForm();

    submitForm();

    expect(screen.getAllByText("필수 정보입니다.")).toHaveLength(2);
    expect(screen.getByLabelText("제목")).toHaveAccessibleDescription("필수 정보입니다.");
    expect(screen.getByLabelText("발송 시간")).toHaveAccessibleDescription("필수 정보입니다.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('S-02 Given 빈 시간 필드 When 선택기에서 2027-04-05 14:35를 고르면 Then 필드에 "2027년 04월 05일 14시 35분"이 보인다', () => {
    renderNotificationForm();

    pickScheduledAt("2027-04-05T14:35");

    expect(screen.getByText("2027년 04월 05일 14시 35분")).toBeInTheDocument();
  });

  it("고른 시간은 제출 값에 그대로 담긴다", async () => {
    const { onSubmit } = renderNotificationForm({ ...EMPTY_VALUES, title: "알림 제목" });

    pickScheduledAt("2099-12-31T14:35");
    submitForm();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        targetType: "all",
        title: "알림 제목",
        scheduledAt: "2099-12-31T14:35",
      });
    });
  });

  it("R-02 제목은 50자까지만 입력된다", () => {
    renderNotificationForm();

    expect(screen.getByLabelText("제목")).toHaveAttribute("maxlength", "50");
  });

  it("대상자는 전체·팔로워·멤버십이고 기본값은 전체다", () => {
    renderNotificationForm();

    expect(screen.getByRole("radio", { name: "전체" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "팔로워" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "멤버십" })).not.toBeChecked();
  });

  it("disabled면 모든 입력이 비활성이다", () => {
    render(
      <NotificationForm
        formId={NOTIFICATION_FORM_ID}
        defaultValues={EMPTY_VALUES}
        onSubmit={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByRole("radio", { name: "전체" })).toBeDisabled();
    expect(screen.getByLabelText("제목")).toBeDisabled();
    expect(screen.getByLabelText("발송 시간")).toBeDisabled();
  });
});
