import { fireEvent, render, screen } from "@testing-library/react";

import { TextArea } from ".";

describe("TextArea 변형", () => {
  it("여러 줄 입력 상자를 렌더링한다", () => {
    render(<TextArea aria-label="내용" placeholder="내용을 입력해주세요." />);
    expect(screen.getByRole("textbox", { name: "내용" })).toHaveAttribute(
      "placeholder",
      "내용을 입력해주세요.",
    );
  });

  it("showCounter와 maxLength가 있으면 현재/최대 카운터를 렌더링한다", () => {
    render(<TextArea aria-label="내용" showCounter maxLength={500} defaultValue="안내" />);
    expect(screen.getByTestId("counter")).toHaveTextContent("2/500");
  });

  it("error가 있으면 aria-invalid와 오류 문구를 가진다", () => {
    render(<TextArea aria-label="내용" error="필수 정보입니다." />);
    const textarea = screen.getByRole("textbox", { name: "내용" });
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription("필수 정보입니다.");
  });

  it("disabled면 비활성 상태가 된다", () => {
    render(<TextArea aria-label="내용" disabled />);
    expect(screen.getByRole("textbox", { name: "내용" })).toBeDisabled();
  });
});

describe("TextArea 동작", () => {
  it("입력하면 카운터가 갱신된다", () => {
    render(<TextArea aria-label="내용" showCounter maxLength={500} />);
    fireEvent.change(screen.getByRole("textbox", { name: "내용" }), {
      target: { value: "공지 내용" },
    });
    expect(screen.getByTestId("counter")).toHaveTextContent("5/500");
  });

  it("value와 onChange로 제어할 수 있다", () => {
    const onChange = vi.fn();
    render(<TextArea aria-label="내용" value="안내" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox", { name: "내용" }), {
      target: { value: "안내문" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
