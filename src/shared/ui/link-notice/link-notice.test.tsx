import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";

import { LinkNotice } from ".";

describe("LinkNotice", () => {
  it("문구와 주어진 경로로 가는 링크를 보인다", () => {
    render(
      <MemoryRouter>
        <LinkNotice message="요청한 내용을 찾을 수 없습니다." linkLabel="목록으로" to="/alarms" />
      </MemoryRouter>,
    );

    expect(screen.getByText("요청한 내용을 찾을 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toHaveAttribute("href", "/alarms");
  });
});
