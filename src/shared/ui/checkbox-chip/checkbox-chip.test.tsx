import { fireEvent, render, screen } from "@testing-library/react";

import { CheckboxChip } from ".";

describe("CheckboxChip 변형", () => {
  it("shape를 주지 않으면 outlined이다", () => {
    render(<CheckboxChip>고객센터</CheckboxChip>);
    expect(screen.getByRole("checkbox", { name: "고객센터" })).toHaveAttribute(
      "data-shape",
      "outlined",
    );
  });

  it("shape solid 변형을 렌더링한다", () => {
    render(<CheckboxChip shape="solid">고객센터</CheckboxChip>);
    expect(screen.getByRole("checkbox", { name: "고객센터" })).toHaveAttribute(
      "data-shape",
      "solid",
    );
  });
});

describe("CheckboxChip 동작", () => {
  it("라벨 문구가 체크박스의 이름이 된다", () => {
    render(<CheckboxChip>고객센터</CheckboxChip>);
    expect(screen.getByRole("checkbox", { name: "고객센터" })).toBeInTheDocument();
  });

  it("클릭하면 체크 상태가 바뀐다", () => {
    render(<CheckboxChip>고객센터</CheckboxChip>);
    const checkbox = screen.getByRole("checkbox", { name: "고객센터" });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("checked와 onChange로 제어할 수 있다", () => {
    const onChange = vi.fn();
    render(
      <CheckboxChip checked onChange={onChange}>
        고객센터
      </CheckboxChip>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "고객센터" });
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("disabled면 비활성 상태가 된다", () => {
    render(<CheckboxChip disabled>고객센터</CheckboxChip>);
    expect(screen.getByRole("checkbox", { name: "고객센터" })).toBeDisabled();
  });
});
