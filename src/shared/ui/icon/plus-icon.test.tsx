import { render, screen } from "@testing-library/react";

import { PlusIcon } from ".";

describe("PlusIcon", () => {
  it("장식용 svg라 접근성 트리에서 숨긴다", () => {
    render(<PlusIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주지 않으면 16px이다", () => {
    render(<PlusIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "16");
  });

  it("size를 주면 그 크기의 정사각형으로 그린다", () => {
    render(<PlusIcon data-testid="icon" size={32} />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("색은 currentColor를 따른다", () => {
    render(<PlusIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("stroke", "currentColor");
  });
});
