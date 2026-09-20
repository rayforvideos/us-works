import { fireEvent, render, screen } from "@testing-library/react";

import { DateTimeField } from ".";

const PLACEHOLDER = "알림 발송 시간을 선택해주세요.";

function renderField(props: Partial<Parameters<typeof DateTimeField>[0]> = {}) {
  const onChange = vi.fn();

  render(
    <DateTimeField
      aria-label="발송 시간"
      placeholder={PLACEHOLDER}
      value=""
      onChange={onChange}
      {...props}
    />,
  );

  return { onChange };
}

describe("DateTimeField", () => {
  it("값이 없으면 placeholder를 보인다", () => {
    renderField();

    expect(screen.getByText(PLACEHOLDER)).toBeInTheDocument();
  });

  it("값이 있으면 `yyyy년 MM월 dd일 HH시 mm분`으로 보인다", () => {
    renderField({ value: "2027-04-05T14:30" });

    expect(screen.getByText("2027년 04월 05일 14시 30분")).toBeInTheDocument();
  });

  it("선택기에서 값을 고르면 고른 값 그대로 onChange가 호출된다", () => {
    const { onChange } = renderField();

    fireEvent.change(screen.getByLabelText("발송 시간"), {
      target: { value: "2027-04-05T14:30" },
    });

    expect(onChange).toHaveBeenCalledWith("2027-04-05T14:30");
  });

  it("step에 맞지 않는 분을 입력하면 가까운 step 단위로 맞춘 값으로 onChange가 호출된다", () => {
    const { onChange } = renderField();

    fireEvent.change(screen.getByLabelText("발송 시간"), {
      target: { value: "2027-04-05T14:15" },
    });

    expect(onChange).toHaveBeenCalledWith("2027-04-05T14:30");
  });

  it("invalid면 aria-invalid가 켜진다", () => {
    renderField({ invalid: true });

    expect(screen.getByLabelText("발송 시간")).toHaveAttribute("aria-invalid", "true");
  });

  it("disabled면 비활성 상태가 된다", () => {
    renderField({ disabled: true });

    expect(screen.getByLabelText("발송 시간")).toBeDisabled();
  });
});
