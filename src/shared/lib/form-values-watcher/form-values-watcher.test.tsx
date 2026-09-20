import { render } from "@testing-library/react";

import { FormValuesWatcher } from ".";

describe("FormValuesWatcher", () => {
  it("아무것도 그리지 않고 바뀐 값을 onChange에 넘긴다", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <FormValuesWatcher values={{ title: "처음" }} onChange={onChange} />,
    );

    rerender(<FormValuesWatcher values={{ title: "다음" }} onChange={onChange} />);

    expect(container).toBeEmptyDOMElement();
    expect(onChange).toHaveBeenLastCalledWith({ title: "다음" });
  });
});
