import { render, screen } from "@testing-library/react";

import { LogoIcon } from ".";

describe("LogoIcon", () => {
  it("장식용 svg라 접근성 트리에서 숨긴다", () => {
    render(<LogoIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주지 않으면 22px 너비다", () => {
    render(<LogoIcon data-testid="icon" />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveAttribute("width", "22");
    expect(svg).toHaveAttribute("height", "14");
  });

  it("size를 주면 22:14 비율을 지킨 높이로 그린다", () => {
    render(<LogoIcon data-testid="icon" size={44} />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveAttribute("width", "44");
    expect(svg).toHaveAttribute("height", "28");
  });
});
