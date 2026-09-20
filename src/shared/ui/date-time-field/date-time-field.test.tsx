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

function openPopover() {
  fireEvent.click(screen.getByRole("button", { name: "발송 시간" }));
}

function pickDate(value: string) {
  fireEvent.change(screen.getByLabelText("발송 날짜"), { target: { value } });
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

  it('S-02 Given 빈 시간 필드 When 팝오버에서 날짜 2027-04-05와 시간 14:30을 고르면 Then 팝오버가 닫히고 필드에 "2027년 04월 05일 14시 30분"이 보인다', async () => {
    const { onChange } = renderField();

    openPopover();
    await screen.findByRole("dialog");
    pickDate("2027-04-05");
    fireEvent.click(screen.getByRole("option", { name: "14:30" }));

    expect(onChange).toHaveBeenCalledWith("2027-04-05T14:30");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Esc로 닫으면 값이 바뀌지 않는다", async () => {
    const { onChange } = renderField();

    openPopover();
    const popup = await screen.findByRole("dialog");
    pickDate("2027-04-05");
    fireEvent.keyDown(popup, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("시간 목록은 00:00부터 23:30까지 30분 간격 48개다", async () => {
    renderField({ value: "2027-04-05T14:30" });

    openPopover();
    await screen.findByRole("dialog");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(48);
    expect(screen.getByRole("option", { name: "14:30" })).toHaveAttribute("aria-selected", "true");
  });

  it("30분 단위가 아닌 현재 값은 목록 맨 앞에 한 번만 더한다", async () => {
    renderField({ value: "2027-04-05T14:15" });

    openPopover();
    await screen.findByRole("dialog");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(49);
    expect(options[0]).toHaveTextContent("14:15");
  });

  it("invalid면 aria-invalid가 켜진다", () => {
    renderField({ invalid: true });

    expect(screen.getByRole("button", { name: "발송 시간" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("disabled면 비활성 상태가 된다", () => {
    renderField({ disabled: true });

    expect(screen.getByRole("button", { name: "발송 시간" })).toBeDisabled();
  });
});
