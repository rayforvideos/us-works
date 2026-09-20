import { fireEvent, render, screen } from "@testing-library/react";

import { Button, type ButtonVariantProps, buttonVariants } from ".";

describe("Button 변형", () => {
  it("속성을 주지 않으면 solid primary large 버튼이다", () => {
    render(<Button>저장</Button>);
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveAttribute("data-variant", "solid");
    expect(button).toHaveAttribute("data-importance", "primary");
    expect(button).toHaveAttribute("data-size", "large");
  });

  it.each([
    ["solid", "primary", "large"],
    ["solid", "primary", "medium"],
    ["solid", "secondary", "large"],
    ["solid", "secondary", "medium"],
    ["solid", "assistive", "large"],
    ["solid", "assistive", "medium"],
  ] as const)("solid %s %s 변형을 렌더링한다", (variant, importance, size) => {
    render(
      <Button variant={variant} importance={importance} size={size}>
        저장
      </Button>,
    );
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveAttribute("data-variant", variant);
    expect(button).toHaveAttribute("data-importance", importance);
    expect(button).toHaveAttribute("data-size", size);
  });

  it.each([
    ["primary", "large"],
    ["primary", "medium"],
    ["primary", "small"],
    ["secondary", "large"],
    ["secondary", "small"],
    ["assistive", "large"],
    ["assistive", "small"],
  ] as const)("outline %s %s 변형을 렌더링한다", (importance, size) => {
    render(
      <Button variant="outline" importance={importance} size={size}>
        취소
      </Button>,
    );
    const button = screen.getByRole("button", { name: "취소" });
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-importance", importance);
    expect(button).toHaveAttribute("data-size", size);
  });

  it("text 변형은 importance가 assistive이고 size가 없다", () => {
    render(<Button variant="text">더보기</Button>);
    const button = screen.getByRole("button", { name: "더보기" });
    expect(button).toHaveAttribute("data-variant", "text");
    expect(button).toHaveAttribute("data-importance", "assistive");
    expect(button).not.toHaveAttribute("data-size");
  });
});

describe("Button 동작", () => {
  it("type 기본값은 button이다", () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute("type", "button");
  });

  it("disabled면 비활성 상태가 된다", () => {
    render(<Button disabled>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
  });

  it("leftIcon과 rightIcon을 이름에 포함하지 않는 장식으로 렌더링한다", () => {
    render(
      <Button leftIcon={<svg data-testid="left" />} rightIcon={<svg data-testid="right" />}>
        저장
      </Button>,
    );
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("loading이면 aria-busy가 켜지고 스피너가 보인다", () => {
    render(
      <Button importance="secondary" size="medium" loading>
        임시저장
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status", { name: "로딩 중" })).toBeInTheDocument();
  });

  it("loading이면 클릭해도 onClick이 호출되지 않는다", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        임시저장
      </Button>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("fullWidth면 data-full-width 속성을 가진다", () => {
    render(<Button fullWidth>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute("data-full-width", "true");
  });

  it("loading이어도 라벨 텍스트는 유지되어 너비가 바뀌지 않는다", () => {
    render(<Button loading>임시저장</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("임시저장");
  });

  it("buttonVariants는 링크에 쓸 클래스 문자열을 돌려준다", () => {
    expect(buttonVariants({ variant: "outline", importance: "primary", size: "small" })).toEqual(
      expect.any(String),
    );
  });

  it("buttonVariants는 컴포넌트와 같은 변형 타입만 받는다", () => {
    expectTypeOf(buttonVariants).parameter(0).toEqualTypeOf<ButtonVariantProps | undefined>();
  });
});

describe("Button 타입", () => {
  it("Figma에 없는 조합은 타입에서 막힌다", () => {
    expectTypeOf<{ variant: "solid"; size: "small" }>().not.toExtend<ButtonVariantProps>();
    expectTypeOf<{ variant: "text"; importance: "primary" }>().not.toExtend<ButtonVariantProps>();
    expectTypeOf<{ variant: "outline"; size: "small" }>().toExtend<ButtonVariantProps>();
    expectTypeOf<{ variant: "outline"; size: "medium" }>().toExtend<ButtonVariantProps>();
  });
});
