import { fireEvent, render, screen } from "@testing-library/react";

import { TextField } from ".";

describe("TextField 변형", () => {
  it("값이 없으면 Default 상태다", () => {
    render(<TextField aria-label="제목" placeholder="제목을 입력해주세요." />);
    expect(screen.getByRole("textbox", { name: "제목" })).toHaveAttribute("data-filled", "false");
  });

  it("값이 있으면 Done 상태다", () => {
    render(<TextField aria-label="제목" defaultValue="안내" />);
    expect(screen.getByRole("textbox", { name: "제목" })).toHaveAttribute("data-filled", "true");
  });

  it("error가 있으면 aria-invalid와 오류 문구를 가진다", () => {
    render(<TextField aria-label="제목" error="필수 정보입니다." />);
    const input = screen.getByRole("textbox", { name: "제목" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("필수 정보입니다.");
  });

  it("disabled면 비활성 상태가 된다", () => {
    render(<TextField aria-label="제목" disabled />);
    expect(screen.getByRole("textbox", { name: "제목" })).toBeDisabled();
  });

  it("clearable이면 지우기 버튼을 렌더링한다", () => {
    render(<TextField aria-label="제목" clearable defaultValue="안내" />);
    expect(screen.getByRole("button", { name: "입력 지우기" })).toBeEnabled();
  });

  it("clearable이어도 값이 없으면 지우기 버튼이 비활성이다", () => {
    render(<TextField aria-label="제목" clearable />);
    expect(screen.getByRole("button", { name: "입력 지우기" })).toBeDisabled();
  });

  it("showCounter와 maxLength가 있으면 현재/최대 카운터를 렌더링한다", () => {
    render(<TextField aria-label="제목" showCounter maxLength={50} defaultValue="안내" />);
    expect(screen.getByTestId("counter")).toHaveTextContent("2/50");
  });
});

describe("TextField 동작", () => {
  it("입력하면 카운터가 갱신된다", () => {
    render(<TextField aria-label="제목" showCounter maxLength={50} />);
    fireEvent.change(screen.getByRole("textbox", { name: "제목" }), { target: { value: "공지" } });
    expect(screen.getByTestId("counter")).toHaveTextContent("2/50");
  });

  it("입력하면 지우기 버튼이 활성화된다", () => {
    render(<TextField aria-label="제목" clearable />);
    fireEvent.change(screen.getByRole("textbox", { name: "제목" }), { target: { value: "공지" } });
    expect(screen.getByRole("button", { name: "입력 지우기" })).toBeEnabled();
  });

  it("지우기 버튼을 누르면 비제어 입력값이 비워지고 onClear가 호출된다", () => {
    const onClear = vi.fn();
    render(<TextField aria-label="제목" clearable defaultValue="안내" onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: "입력 지우기" }));
    expect(screen.getByRole("textbox", { name: "제목" })).toHaveValue("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("value와 onChange로 제어할 수 있다", () => {
    const onChange = vi.fn();
    render(<TextField aria-label="제목" value="안내" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "제목" });
    expect(input).toHaveValue("안내");
    fireEvent.change(input, { target: { value: "안내문" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("maxLength를 input에 전달한다", () => {
    render(<TextField aria-label="제목" maxLength={50} />);
    expect(screen.getByRole("textbox", { name: "제목" })).toHaveAttribute("maxlength", "50");
  });
});
