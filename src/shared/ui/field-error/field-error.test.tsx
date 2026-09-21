import { render, screen } from "@testing-library/react";

import { FieldError } from ".";

describe("FieldError", () => {
  it("오류가 없어도 자리를 남겨 아래 요소가 밀리지 않는다", () => {
    render(<FieldError />);

    const slot = screen.getByTestId("error-text");
    expect(slot).toBeEmptyDOMElement();
    expect(slot).toHaveClass("min-h-3");
  });

  it("자리를 남기지 않게 하면 오류가 없을 때 아무것도 그리지 않는다", () => {
    render(<FieldError reserve={false} />);

    expect(screen.queryByTestId("error-text")).not.toBeInTheDocument();
  });

  it("오류 문구를 그리고 연결할 id를 받는다", () => {
    render(<FieldError id="field-error" error="필수 정보입니다." />);

    const slot = screen.getByText("필수 정보입니다.");
    expect(slot).toHaveAttribute("id", "field-error");
  });
});
