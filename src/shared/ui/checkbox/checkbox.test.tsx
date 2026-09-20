import { fireEvent, render, screen } from "@testing-library/react";

import { Checkbox } from ".";

describe("Checkbox 변형", () => {
  it("size를 주지 않으면 medium이다", () => {
    render(<Checkbox aria-label="동의" />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toHaveAttribute("data-size", "medium");
  });

  it("size large 변형을 렌더링한다", () => {
    render(<Checkbox size="large" aria-label="동의" />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toHaveAttribute("data-size", "large");
  });
});

describe("Checkbox 동작", () => {
  it("클릭하면 체크 상태가 바뀐다", () => {
    render(<Checkbox aria-label="동의" />);
    const checkbox = screen.getByRole("checkbox", { name: "동의" });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("checked와 onChange로 제어할 수 있다", () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="동의" checked onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "동의" });
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("disabled면 비활성 상태가 된다", () => {
    render(<Checkbox aria-label="동의" disabled />);
    expect(screen.getByRole("checkbox", { name: "동의" })).toBeDisabled();
  });

  it("label 요소로 감싸면 라벨 문구가 이름이 된다", () => {
    render(
      <label>
        <Checkbox />
        약관 동의
      </label>,
    );
    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toBeInTheDocument();
  });
});
