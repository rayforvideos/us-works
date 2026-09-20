import { fireEvent, render, screen } from "@testing-library/react";

import { RadioGroup, RadioGroupItem } from ".";

function renderGroup(props: Partial<Parameters<typeof RadioGroup>[0]> = {}) {
  return render(
    <RadioGroup name="plan" aria-label="요금제" {...props}>
      <RadioGroupItem value="basic" label="기본" />
      <RadioGroupItem value="pro" label="프로" subLabel="월 9,900원" />
    </RadioGroup>,
  );
}

describe("RadioGroup 변형", () => {
  it("그룹은 radiogroup 역할과 이름을 가진다", () => {
    renderGroup();
    expect(screen.getByRole("radiogroup", { name: "요금제" })).toBeInTheDocument();
  });

  it("서브라벨이 없는 항목은 1 Line이다", () => {
    renderGroup();
    expect(screen.getByRole("radio", { name: "기본" })).toHaveAttribute("data-lines", "1");
  });

  it("서브라벨이 있는 항목은 2 Lines이다", () => {
    renderGroup();
    expect(screen.getByRole("radio", { name: /^프로/ })).toHaveAttribute("data-lines", "2");
  });
});

describe("RadioGroup 동작", () => {
  it("항목은 같은 name을 공유한다", () => {
    renderGroup();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("name", "plan");
    }
  });

  it("defaultValue와 같은 항목이 처음에 선택된다", () => {
    renderGroup({ defaultValue: "pro" });
    expect(screen.getByRole("radio", { name: "기본" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /^프로/ })).toBeChecked();
  });

  it("항목을 클릭하면 onValueChange가 그 값으로 호출된다", () => {
    const onValueChange = vi.fn();
    renderGroup({ onValueChange });
    fireEvent.click(screen.getByRole("radio", { name: "기본" }));
    expect(onValueChange).toHaveBeenCalledWith("basic");
  });

  it("value를 주면 제어 컴포넌트로 동작한다", () => {
    renderGroup({ value: "basic", onValueChange: vi.fn() });
    expect(screen.getByRole("radio", { name: "기본" })).toBeChecked();
    expect(screen.getByRole("radio", { name: /^프로/ })).not.toBeChecked();
  });

  it("그룹이 disabled면 모든 항목이 비활성이다", () => {
    renderGroup({ disabled: true });
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("RadioGroup 밖의 항목은 오류를 던진다", () => {
    expect(() => render(<RadioGroupItem value="x" label="x" />)).toThrow(
      "RadioGroupItem은 RadioGroup 안에서만 쓸 수 있습니다.",
    );
  });
});
