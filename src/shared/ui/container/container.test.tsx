import { type ComponentProps, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { Container } from ".";

describe("Container", () => {
  it("자식을 그대로 렌더링한다", () => {
    render(<Container>본문</Container>);

    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("as에 main을 주면 main 랜드마크로 렌더링한다", () => {
    render(<Container as="main">본문</Container>);

    expect(screen.getByRole("main")).toHaveTextContent("본문");
  });

  it("as는 div, section, main만 받는다", () => {
    expectTypeOf<{ as: "main"; children: ReactNode }>().toExtend<
      ComponentProps<typeof Container>
    >();
    expectTypeOf<{ as: "span"; children: ReactNode }>().not.toExtend<
      ComponentProps<typeof Container>
    >();
  });
});
