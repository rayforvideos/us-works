import { render, screen } from "@testing-library/react";

import { Spinner } from ".";

describe("Spinner", () => {
  it("로딩 중임을 알리는 status 역할을 가진다", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "로딩 중" })).toBeInTheDocument();
  });

  it("aria-label을 주면 그 이름으로 읽힌다", () => {
    render(<Spinner aria-label="저장 중" />);
    expect(screen.getByRole("status", { name: "저장 중" })).toBeInTheDocument();
  });

  it("size를 주지 않으면 16px이다", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("data-size", "16");
  });

  it("size를 주면 그 크기로 그린다", () => {
    render(<Spinner size={24} />);
    expect(screen.getByRole("status")).toHaveAttribute("data-size", "24");
  });
});
