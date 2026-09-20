import { type ComponentProps } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import {
  type Content,
  CONTENT_FIXTURE,
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";

import { ContentTable } from ".";

function renderContentTable(props: Partial<ComponentProps<typeof ContentTable>> = {}) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ContentTable
            contents={CONTENT_FIXTURE}
            isLoading={false}
            error={null}
            onRetry={vi.fn()}
            emptyMessage="콘텐츠가 없습니다."
            {...props}
          />
        ),
      },
      { path: "/contents/:id", element: <p>상세 화면</p> },
      { path: "/alarms/new", element: <p>알람 작성 화면</p> },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);

  return { router };
}

function getRow(title: string): HTMLElement {
  return screen.getByRole("row", { name: new RegExp(title) });
}

describe("ContentTable", () => {
  it("S-01 Given 목록을 불러오는 중 When 페이지가 렌더링되면 Then 표 영역에 로딩 표시가 보인다", () => {
    renderContentTable({ contents: [], isLoading: true });

    expect(screen.getByRole("status", { name: "목록 불러오는 중" })).toBeInTheDocument();
  });

  it("S-02 Given 목록 응답이 있을 때 When 렌더링되면 Then 행마다 번호, 제목, 공개일자, 상태 배지가 보인다", () => {
    renderContentTable();

    const publishedRow = getRow(PUBLISHED_CONTENT_FIXTURE.title);
    expect(within(publishedRow).getByText("1")).toBeInTheDocument();
    expect(within(publishedRow).getByRole("link", { name: "첫 번째 콘텐츠" })).toBeInTheDocument();
    expect(within(publishedRow).getByText("26.09.20")).toBeInTheDocument();
    expect(within(publishedRow).getByText("10:30")).toBeInTheDocument();
    expect(within(publishedRow).getByText("공개")).toHaveAttribute("data-tone", "green");

    const scheduledRow = getRow(SCHEDULED_CONTENT_FIXTURE.title);
    expect(within(scheduledRow).getByText("예약")).toHaveAttribute("data-tone", "yellow");

    const draftRow = getRow(DRAFT_CONTENT_FIXTURE.title);
    expect(within(draftRow).getByText("-")).toBeInTheDocument();
    expect(within(draftRow).getByText("비공개")).toHaveAttribute("data-tone", "grey");
  });

  it('S-03 Given 목록이 비어 있을 때 When 렌더링되면 Then "콘텐츠가 없습니다."가 보인다', () => {
    renderContentTable({ contents: [] });

    expect(screen.getByText("콘텐츠가 없습니다.")).toBeInTheDocument();
  });

  it('S-04 Given 목록 요청이 실패했을 때 When 렌더링되면 Then 오류 문구와 "다시 시도" 버튼이 보이고 버튼을 누르면 다시 요청한다', () => {
    const onRetry = vi.fn();
    renderContentTable({ contents: [], error: new Error("boom"), onRetry });

    expect(screen.getByText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("S-07 Given 목록 행이 있을 때 When 행을 클릭하면 Then `/contents/<id>`로 이동한다", async () => {
    const { router } = renderContentTable();

    fireEvent.click(getRow(PUBLISHED_CONTENT_FIXTURE.title));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/contents/1");
    });
  });

  it('S-08 Given 알림이 없는 콘텐츠 행 When 행에 포커스하고 "푸시알림 생성"을 누르면 Then `/alarms/new?contentId=<id>`로 이동하고 행 클릭 이동은 일어나지 않는다', async () => {
    const { router } = renderContentTable();

    const publishedRow = getRow(PUBLISHED_CONTENT_FIXTURE.title);
    fireEvent.click(within(publishedRow).getByRole("link", { name: "푸시알림 생성" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/alarms/new");
    });
    expect(router.state.location.search).toBe("?contentId=1");
  });

  it('S-09 Given 알림이 있는 콘텐츠 행 When 행에 포커스하면 Then "푸시알림 생성" 버튼이 없다', () => {
    renderContentTable();

    const scheduledRow = getRow(SCHEDULED_CONTENT_FIXTURE.title);
    expect(within(scheduledRow).queryByRole("link", { name: "푸시알림 생성" })).toBeNull();
  });

  it('S-14 Given 콘텐츠 목록의 비공개 콘텐츠 행 When 보면 Then "푸시알림 생성" 버튼이 없다', () => {
    const hiddenScheduledContent = {
      ...DRAFT_CONTENT_FIXTURE,
      id: 4,
      title: "네 번째 콘텐츠",
      publish_status: "scheduled",
      published_at: "2026-10-05T09:00:00+09:00",
    } satisfies Content;
    renderContentTable({ contents: [DRAFT_CONTENT_FIXTURE, hiddenScheduledContent] });

    const draftRow = getRow(DRAFT_CONTENT_FIXTURE.title);
    expect(within(draftRow).queryByRole("link", { name: "푸시알림 생성" })).toBeNull();

    const scheduledRow = getRow(hiddenScheduledContent.title);
    expect(within(scheduledRow).getByRole("link", { name: "푸시알림 생성" })).toBeInTheDocument();
  });

  it("이미 보이는 목록을 다시 불러오는 중이면 표가 aria-busy가 된다", () => {
    renderContentTable({ isFetching: true });

    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("link", { name: "첫 번째 콘텐츠" })).toBeInTheDocument();
  });

  it("행이 없으면 다시 불러오는 중이어도 aria-busy를 켜지 않는다", () => {
    renderContentTable({ contents: [], isFetching: true });

    expect(screen.getByRole("table")).not.toHaveAttribute("aria-busy");
  });
});
