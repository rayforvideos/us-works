import { type ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Dialog } from ".";

function renderDialog(open: boolean, props: Partial<ComponentProps<typeof Dialog>> = {}) {
  const onOpenChange = vi.fn();

  render(
    <Dialog open={open} onOpenChange={onOpenChange} title="새글쓰기" {...props}>
      <p>본문</p>
    </Dialog>,
  );

  return { onOpenChange };
}

function pressOutside() {
  fireEvent.pointerDown(document.body);
  fireEvent.mouseDown(document.body);
  fireEvent.click(document.body);
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

  it("footer를 넘기면 본문 아래에 그 내용을 보인다", () => {
    renderDialog(true, { footer: <button type="button">발행하기</button> });

    expect(screen.getByRole("button", { name: "발행하기" })).toBeInTheDocument();
  });

  it("배경을 누르면 onOpenChange(false)가 호출된다", () => {
    const { onOpenChange } = renderDialog(true);

    pressOutside();

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disableOutsideClick이면 배경을 눌러도 닫히지 않는다", () => {
    const { onOpenChange } = renderDialog(true, { disableOutsideClick: true });

    pressOutside();

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
