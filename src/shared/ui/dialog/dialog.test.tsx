import { fireEvent, render, screen } from "@testing-library/react";

import { Dialog } from ".";

function renderDialog(open: boolean, onOpenChange = vi.fn()) {
  render(
    <Dialog open={open} onOpenChange={onOpenChange} title="새글쓰기">
      <p>본문</p>
    </Dialog>,
  );

  return { onOpenChange };
}

describe("Dialog", () => {
  it("open이면 dialog 역할과 제목이 보인다", () => {
    renderDialog(true);

    expect(screen.getByRole("dialog", { name: "새글쓰기" })).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("닫기 버튼을 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange } = renderDialog(true);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Esc를 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange } = renderDialog(true);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("open이 아니면 렌더링하지 않는다", () => {
    renderDialog(false);

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
