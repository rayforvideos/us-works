import { type ReactNode } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { render, screen } from "@testing-library/react";

import { LIST_TABS, ListHeader } from ".";
import { type ListHeaderTab } from "./types";

const CUSTOM_TABS: readonly ListHeaderTab[] = [
  { label: "첫 번째", to: "/" },
  { label: "두 번째", to: "/alarms" },
];

function renderListHeader(
  pathname: string,
  {
    action,
    tabs = LIST_TABS,
    homeTo = "/",
  }: { action?: ReactNode; tabs?: readonly ListHeaderTab[]; homeTo?: string } = {},
) {
  const element = <ListHeader homeTo={homeTo} tabs={tabs} action={action} />;
  const router = createMemoryRouter(
    [
      { path: "/", element },
      { path: "/alarms", element },
    ],
    { initialEntries: [pathname] },
  );

  render(<RouterProvider router={router} />);

  return { router };
}

describe("ListHeader", () => {
  it("로고 링크는 넘긴 홈 경로를 가리킨다", () => {
    renderListHeader("/alarms", { homeTo: "/alarms" });

    expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute("href", "/alarms");
  });

  it("넘긴 탭 목록을 그대로 그린다", () => {
    renderListHeader("/", { tabs: CUSTOM_TABS });

    expect(screen.getByRole("link", { name: "첫 번째" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "두 번째" })).toHaveAttribute("href", "/alarms");
    expect(screen.queryByRole("link", { name: "콘텐츠" })).toBeNull();
  });

  it("현재 경로의 탭이 선택 상태다", () => {
    renderListHeader("/alarms");

    expect(screen.getByRole("link", { name: "알람" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "콘텐츠" })).not.toHaveAttribute("aria-current");
  });

  it("action을 주면 오른쪽 자리에 렌더링한다", () => {
    renderListHeader("/", { action: <button type="button">새 글쓰기</button> });

    expect(screen.getByRole("button", { name: "새 글쓰기" })).toBeInTheDocument();
  });
});
