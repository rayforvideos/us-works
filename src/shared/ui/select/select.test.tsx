import { fireEvent, render, screen } from "@testing-library/react";

import { Select, type SelectItem } from ".";

const ITEMS: readonly SelectItem[] = [
  { value: "notice", label: "공지사항" },
  { value: "guide", label: "거래안내" },
  { value: "off", label: "비활성", disabled: true },
];

function renderSelect(props: Partial<Parameters<typeof Select>[0]> = {}) {
  return render(
    <Select
      aria-label="카테고리"
      placeholder="카테고리를 선택해주세요."
      items={ITEMS}
      {...props}
    />,
  );
}

function pick(option: HTMLElement) {
  fireEvent.pointerDown(option);
  fireEvent.click(option);
}

describe("Select 변형", () => {
  it("값이 없으면 플레이스홀더를 보여주는 Default 상태다", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox", { name: "카테고리" });
    expect(trigger).toHaveTextContent("카테고리를 선택해주세요.");
    expect(trigger).toHaveAttribute("data-placeholder");
  });

  it("값이 있으면 선택한 항목의 라벨을 보여준다", () => {
    renderSelect({ defaultValue: "guide" });
    const trigger = screen.getByRole("combobox", { name: "카테고리" });
    expect(trigger).toHaveTextContent("거래안내");
    expect(trigger).not.toHaveAttribute("data-placeholder");
  });

  it("disabled면 비활성 상태가 된다", () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole("combobox", { name: "카테고리" })).toHaveAttribute("data-disabled");
  });
});

describe("Select 동작", () => {
  it("트리거를 누르면 목록이 열리고 항목을 보여준다", async () => {
    renderSelect();
    fireEvent.click(screen.getByRole("combobox", { name: "카테고리" }));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("열린 목록에서 선택된 항목은 aria-selected다", async () => {
    renderSelect({ defaultValue: "notice" });
    fireEvent.click(screen.getByRole("combobox", { name: "카테고리" }));
    expect(await screen.findByRole("option", { name: "공지사항" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("disabled 항목은 aria-disabled다", async () => {
    renderSelect();
    fireEvent.click(screen.getByRole("combobox", { name: "카테고리" }));
    expect(await screen.findByRole("option", { name: "비활성" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("항목을 고르면 onValueChange가 값과 함께 호출된다", async () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    fireEvent.click(screen.getByRole("combobox", { name: "카테고리" }));
    pick(await screen.findByRole("option", { name: "거래안내" }));
    expect(onValueChange).toHaveBeenCalledWith("guide", expect.anything());
  });

  it("name을 주면 폼 값으로 전달된다", () => {
    render(
      <form data-testid="form">
        <Select aria-label="카테고리" items={ITEMS} name="category" defaultValue="notice" />
      </form>,
    );
    const form = screen.getByTestId<HTMLFormElement>("form");
    expect(new FormData(form).get("category")).toBe("notice");
  });
});
