import { render, screen } from "@testing-library/react";

import { RoundCancelIcon } from ".";

describe("RoundCancelIcon", () => {
  it("장식용 svg라 접근성 트리에서 숨긴다", () => {
    render(<RoundCancelIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("size를 주지 않으면 24px이다", () => {
    render(<RoundCancelIcon data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("width", "24");
  });
});
