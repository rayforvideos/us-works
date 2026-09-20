import { render, screen } from "@testing-library/react";

import { Logo } from ".";

describe("Logo", () => {
  it("장식용 svg라 접근성 트리에서 숨긴다", () => {
    render(<Logo data-testid="logo" />);
    expect(screen.getByTestId("logo")).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주면 그 크기의 정사각형으로 그린다", () => {
    render(<Logo data-testid="logo" size={40} />);
    const svg = screen.getByTestId("logo");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("size를 주지 않으면 134px이다", () => {
    render(<Logo data-testid="logo" />);
    expect(screen.getByTestId("logo")).toHaveAttribute("width", "134");
  });
});
