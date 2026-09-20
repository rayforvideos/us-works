import { type ReactNode } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ListHeader } from ".";
import { type ListHeaderTab } from "./types";

const LIST_TABS: readonly ListHeaderTab[] = [
  { label: "콘텐츠", to: "/", end: true },
  { label: "알람", to: "/alarms" },
];

const CUSTOM_TABS: readonly ListHeaderTab[] = [
  { label: "첫 번째", to: "/" },
  { label: "두 번째", to: "/alarms" },
];

function renderListHeader(
  pathname: string,
  { action, tabs = LIST_TABS }: { action?: ReactNode; tabs?: readonly ListHeaderTab[] } = {},
) {
  const element = <ListHeader tabs={tabs} action={action} />;
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
  it('S-10 Given 콘텐츠 탭 When "알람" 탭을 누르면 Then `/alarms`로 이동한다', async () => {
    const { router } = renderListHeader("/");

    fireEvent.click(screen.getByRole("link", { name: "알람" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/alarms");
    });
  });

  it("S-11 Given 아래로 스크롤된 상태 When 로고를 누르면 Then 창 스크롤이 맨 위로 이동한다", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    renderListHeader("/");

    fireEvent.click(screen.getByRole("button", { name: "맨 위로" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
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
