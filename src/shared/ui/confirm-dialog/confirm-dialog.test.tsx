import { fireEvent, render, screen } from "@testing-library/react";

import { ConfirmDialog } from ".";

function renderConfirmDialog(open = true) {
  const onOpenChange = vi.fn();
  const onConfirm = vi.fn();

  render(
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="작성을 종료하시겠습니까?"
      description="작성 중인 글은 저장되지 않아요."
      cancelLabel="아니오"
      confirmLabel="네"
      onConfirm={onConfirm}
    />,
  );

  return { onOpenChange, onConfirm };
}

describe("ConfirmDialog", () => {
  it("open이면 제목과 설명을 가진 dialog가 보인다", () => {
    renderConfirmDialog();

    const dialog = screen.getByRole("dialog", { name: "작성을 종료하시겠습니까?" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription("작성 중인 글은 저장되지 않아요.");
  });

  it("취소 버튼을 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange, onConfirm } = renderConfirmDialog();

    fireEvent.click(screen.getByRole("button", { name: "아니오" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("확인 버튼을 누르면 onConfirm이 한 번 호출된다", () => {
    const { onConfirm } = renderConfirmDialog();

    fireEvent.click(screen.getByRole("button", { name: "네" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("닫기 버튼을 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange } = renderConfirmDialog();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Esc를 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange } = renderConfirmDialog();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("open이 아니면 렌더링하지 않는다", () => {
    renderConfirmDialog(false);

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
