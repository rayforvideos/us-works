import { type InitialEntry } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { CONTENT_FIXTURE } from "@/entities/content";
import { createOkResponse, readCallParams, renderWithProviders } from "@/shared/testing";

import { ContentsPage } from ".";

const TOTAL = 25;

/**
 * @constants
 */
const ROUTES_UNDER_TEST = [
  { path: "/", element: <ContentsPage /> },
  { path: "/alarms", element: <p>알람 화면</p> },
];

function renderContentsPage(initialEntries: InitialEntry[] = ["/"]) {
  return renderWithProviders({
    routes: ROUTES_UNDER_TEST,
    respond: () =>
      createOkResponse({ contents: CONTENT_FIXTURE, total: TOTAL, page: 1, limit: 10 }),
    initialEntries,
  });
}

function renderEmptyContentsPage(initialEntries: InitialEntry[] = ["/"]) {
  return renderWithProviders({
    routes: ROUTES_UNDER_TEST,
    respond: () => createOkResponse({ contents: [], total: 0, page: 1, limit: 10 }),
    initialEntries,
  });
}

describe("ContentsPage", () => {
  it("목록이 비어 있으면 페이지네이션을 그리지 않는다", async () => {
    renderEmptyContentsPage();

    expect(await screen.findByText("콘텐츠가 없습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "페이지" })).not.toBeInTheDocument();
  });

  it("30 필터가 걸린 채 목록이 비어 있으면 조건에 맞는 콘텐츠가 없다고 알린다", async () => {
    renderEmptyContentsPage(["/?publish_status=published"]);

    expect(await screen.findByText("조건에 맞는 콘텐츠가 없습니다.")).toBeInTheDocument();
    expect(screen.queryByText("콘텐츠가 없습니다.")).not.toBeInTheDocument();
  });

  it('S-05 Given 2페이지를 보고 있을 때 When 상태 필터를 "공개"로 바꾸면 Then URL이 `?publish_status=published`가 되고 1페이지를 요청한다', async () => {
    const { router, calls } = renderContentsPage(["/?page=2"]);

    await waitFor(() => {
      expect(readCallParams(calls).page).toBe(2);
    });

    fireEvent.click(screen.getByRole("combobox", { name: "상태" }));
    const option = await screen.findByRole("option", { name: "공개" });
    fireEvent.pointerDown(option);
    fireEvent.click(option);

    await waitFor(() => {
      expect(router.state.location.search).toBe("?publish_status=published");
    });
    await waitFor(() => {
      expect(readCallParams(calls)).toMatchObject({ page: 1, publish_status: "published" });
    });
  });

  it("S-06 Given 1페이지를 보고 있을 때 When 2페이지를 누르면 Then URL이 `?page=2`가 되고 2페이지를 요청한다", async () => {
    const { router, calls } = renderContentsPage();

    fireEvent.click(await screen.findByRole("button", { name: "2페이지" }));

    await waitFor(() => {
      expect(router.state.location.search).toBe("?page=2");
    });
    await waitFor(() => {
      expect(readCallParams(calls).page).toBe(2);
    });
  });

  it('37 S-01 Given 목록 페이지 When "새 글쓰기"를 누르면 Then "새글쓰기" 다이얼로그가 열린다', () => {
    renderContentsPage();

    fireEvent.click(screen.getByRole("button", { name: "새 글쓰기" }));

    expect(screen.getByRole("dialog", { name: "새글쓰기" })).toBeInTheDocument();
  });

  it("목록을 받으면 제목과 행, 페이지네이션을 보여준다", async () => {
    renderContentsPage();

    expect(await screen.findByRole("link", { name: "첫 번째 콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "페이지" })).toBeInTheDocument();
  });

  it('S-10 Given 콘텐츠 탭 When "알람" 탭을 누르면 Then `/alarms`로 이동한다', async () => {
    const { router } = renderContentsPage();

    fireEvent.click(await screen.findByRole("link", { name: "알람" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/alarms");
    });
  });

  it("S-11 Given 아래로 스크롤된 콘텐츠 목록 When 로고를 누르면 Then `/`로 이동하고 창 스크롤이 맨 위로 이동한다", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const { router } = renderContentsPage(["/?page=2"]);

    fireEvent.click(await screen.findByRole("link", { name: "홈으로" }));

    await waitFor(() => {
      expect(router.state.location.search).toBe("");
    });
    expect(router.state.location.pathname).toBe("/");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    scrollTo.mockRestore();
  });
});
