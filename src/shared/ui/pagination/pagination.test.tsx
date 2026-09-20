import { fireEvent, render, screen } from "@testing-library/react";

import { Pagination } from ".";

describe("Pagination", () => {
  it("R-06 페이지네이션은 현재 페이지를 가운데 둔 최대 5개 번호를 보이고, 첫 페이지에서 이전, 마지막 페이지에서 다음이 비활성이다", () => {
    const { rerender } = render(<Pagination page={1} pageCount={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "1페이지" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "5페이지" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "6페이지" })).toBeNull();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeEnabled();

    rerender(<Pagination page={7} pageCount={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "7페이지" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "5페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9페이지" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "4페이지" })).toBeNull();

    rerender(<Pagination page={10} pageCount={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeEnabled();
  });

  it("번호를 누르면 그 번호로 onPageChange를 호출한다", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={10} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "3페이지" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("페이지 수를 넘는 현재 페이지는 마지막 페이지가 선택 상태다", () => {
    render(<Pagination page={20} pageCount={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "10페이지" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("페이지가 하나면 이전과 다음이 모두 비활성이다", () => {
    render(<Pagination page={1} pageCount={1} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1페이지" })).toBeInTheDocument();
  });
});
