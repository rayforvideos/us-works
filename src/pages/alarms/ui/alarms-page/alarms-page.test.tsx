import { createMemoryRouter, type InitialEntry } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { NOTIFICATION_FIXTURE } from "@/entities/notification";
import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readCallParams } from "@/shared/config";

import { AlarmsPage } from ".";

const TOTAL = 25;

function renderAlarmsPage(initialEntries: InitialEntry[] = ["/alarms"]) {
  const { adapter, calls } = createFakeAdapter(() =>
    createOkResponse({ notifications: NOTIFICATION_FIXTURE, total: TOTAL, page: 1, limit: 10 }),
  );
  const router = createMemoryRouter(
    [
      { path: "/alarms", element: <AlarmsPage /> },
      { path: "/", element: <p>콘텐츠 화면</p> },
    ],
    { initialEntries },
  );

  render(
    <QueryClientProvider client={createQueryClient({ queries: { retry: false } })}>
      <HttpClientProvider client={createHttpClient({ baseUrl: "http://api.test", adapter })}>
        <RouterProvider router={router} />
      </HttpClientProvider>
    </QueryClientProvider>,
  );

  return { router, calls };
}

describe("AlarmsPage", () => {
  it("S-05 Given 1페이지를 보고 있을 때 When 2페이지를 누르면 Then URL이 `?page=2`가 되고 2페이지를 요청한다", async () => {
    const { router, calls } = renderAlarmsPage();

    fireEvent.click(await screen.findByRole("button", { name: "2페이지" }));

    await waitFor(() => {
      expect(router.state.location.search).toBe("?page=2");
    });
    await waitFor(() => {
      expect(readCallParams(calls).page).toBe(2);
    });
  });

  it('S-07 Given 알람 탭 When "콘텐츠" 탭을 누르면 Then `/`로 이동한다', async () => {
    const { router } = renderAlarmsPage();

    fireEvent.click(screen.getByRole("link", { name: "콘텐츠" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it('37 S-07 Given 알람 탭 When "새 글쓰기"를 누르면 Then 같은 다이얼로그가 열린다', () => {
    renderAlarmsPage();

    fireEvent.click(screen.getByRole("button", { name: "새 글쓰기" }));

    expect(screen.getByRole("dialog", { name: "새글쓰기" })).toBeInTheDocument();
  });

  it('S-08 Given `/alarms`에 있을 때 When 헤더를 보면 Then "알람" 탭이 선택 상태다', () => {
    renderAlarmsPage();

    expect(screen.getByRole("link", { name: "알람" })).toHaveAttribute("aria-current", "page");
  });

  it("S-09 Given 알람 탭 When 로고를 누르면 Then `/`로 이동하고 창 스크롤이 맨 위로 이동한다", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const { router } = renderAlarmsPage();

    fireEvent.click(screen.getByRole("link", { name: "홈으로" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("목록을 받으면 제목과 행, 페이지네이션을 보여준다", async () => {
    renderAlarmsPage();

    expect(await screen.findByRole("link", { name: "첫 번째 알림" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "알람" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "페이지" })).toBeInTheDocument();
  });
});
