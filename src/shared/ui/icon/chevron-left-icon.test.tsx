import { render, screen } from "@testing-library/react";

import { ChevronLeftIcon } from ".";

describe("ChevronLeftIcon", () => {
  it("장식용 svg라 접근성 트리에서 숨긴다", () => {
    render(<ChevronLeftIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주지 않으면 16px이다", () => {
    render(<ChevronLeftIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "16");
  });

  it("size를 주면 그 크기의 정사각형으로 그린다", () => {
    render(<ChevronLeftIcon data-testid="icon" size={24} />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });
});
