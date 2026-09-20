import { render, screen } from "@testing-library/react";

import { StatusBadge } from ".";

describe("StatusBadge 변형", () => {
  it.each([
    ["green", "발송"],
    ["red", "실패"],
    ["yellow", "예약"],
    ["grey", "미발송"],
  ] as const)("tone %s 변형을 문구와 함께 렌더링한다", (tone, text) => {
    render(<StatusBadge tone={tone}>{text}</StatusBadge>);
    const badge = screen.getByText(text);
    expect(badge).toHaveAttribute("data-tone", tone);
    expect(badge).toHaveAttribute("data-dot", "true");
  });

  it("showDot이 false면 점 없이 렌더링한다", () => {
    render(
      <StatusBadge tone="green" showDot={false}>
        발송
      </StatusBadge>,
    );
    expect(screen.getByText("발송")).toHaveAttribute("data-dot", "false");
  });
});

describe("StatusBadge 동작", () => {
  it("점은 장식이라 텍스트 내용은 문구만이다", () => {
    render(<StatusBadge tone="red">실패</StatusBadge>);
    expect(screen.getByText("실패")).toHaveTextContent(/^실패$/);
  });

  it("span 속성을 그대로 전달한다", () => {
    render(
      <StatusBadge tone="grey" title="발송 상태">
        미발송
      </StatusBadge>,
    );
    expect(screen.getByTitle("발송 상태")).toBeInTheDocument();
  });
});
