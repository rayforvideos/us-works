import { type ComponentProps } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import {
  FAILED_NOTIFICATION_FIXTURE,
  NOTIFICATION_FIXTURE,
  PENDING_NOTIFICATION_FIXTURE,
  SENT_NOTIFICATION_FIXTURE,
} from "@/entities/notification";

import { NotificationTable } from ".";

function renderNotificationTable(props: Partial<ComponentProps<typeof NotificationTable>> = {}) {
  const router = createMemoryRouter(
    [
      {
        path: "/alarms",
        element: (
          <NotificationTable
            notifications={NOTIFICATION_FIXTURE}
            isLoading={false}
            error={null}
            onRetry={vi.fn()}
            emptyMessage="알림이 없습니다."
            {...props}
          />
        ),
      },
      { path: "/alarms/:id", element: <p>상세 화면</p> },
    ],
    { initialEntries: ["/alarms"] },
  );

  render(<RouterProvider router={router} />);

  return { router };
}

function getRow(title: string): HTMLElement {
  return screen.getByRole("row", { name: new RegExp(title) });
}

describe("NotificationTable", () => {
  it("S-01 Given 목록을 불러오는 중 When 페이지가 렌더링되면 Then 표 영역에 로딩 표시가 보인다", () => {
    renderNotificationTable({ notifications: [], isLoading: true });

    expect(screen.getByRole("status", { name: "목록 불러오는 중" })).toBeInTheDocument();
  });

  it("S-02 Given 목록 응답이 있을 때 When 렌더링되면 Then 행마다 번호, 제목, 발송 성공, 발송 실패, 발송 날짜, 상태 배지가 보인다", () => {
    renderNotificationTable();

    const sentRow = getRow(SENT_NOTIFICATION_FIXTURE.title);
    expect(within(sentRow).getByText("1")).toBeInTheDocument();
    expect(within(sentRow).getByRole("link", { name: "첫 번째 알림" })).toBeInTheDocument();
    expect(within(sentRow).getByText("120")).toBeInTheDocument();
    expect(within(sentRow).getByText("3")).toBeInTheDocument();
    expect(within(sentRow).getByText("2026.09.20")).toBeInTheDocument();
    expect(within(sentRow).getByText("10:30")).toBeInTheDocument();
    expect(within(sentRow).getByText("발송")).toHaveAttribute("data-tone", "green");

    const pendingRow = getRow(PENDING_NOTIFICATION_FIXTURE.title);
    expect(within(pendingRow).getAllByText("-")).toHaveLength(2);
    expect(within(pendingRow).getByText("예약")).toHaveAttribute("data-tone", "yellow");

    const failedRow = getRow(FAILED_NOTIFICATION_FIXTURE.title);
    expect(within(failedRow).getByText("0")).toBeInTheDocument();
    expect(within(failedRow).getByText("12")).toBeInTheDocument();
    expect(within(failedRow).getByText("실패")).toHaveAttribute("data-tone", "red");
  });

  it('S-03 Given 목록이 비어 있을 때 When 렌더링되면 Then "알림이 없습니다."가 보인다', () => {
    renderNotificationTable({ notifications: [] });

    expect(screen.getByText("알림이 없습니다.")).toBeInTheDocument();
  });

  it('S-04 Given 목록 요청이 실패했을 때 When 렌더링되면 Then 오류 문구와 "다시 시도" 버튼이 보이고 버튼을 누르면 다시 요청한다', () => {
    const onRetry = vi.fn();
    renderNotificationTable({ notifications: [], error: new Error("boom"), onRetry });

    expect(screen.getByText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("S-06 Given 목록 행이 있을 때 When 행을 클릭하면 Then `/alarms/<id>`로 이동한다", async () => {
    const { router } = renderNotificationTable();

    fireEvent.click(getRow(SENT_NOTIFICATION_FIXTURE.title));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/alarms/1");
    });
  });

  it("이미 보이는 목록을 다시 불러오는 중이면 표가 aria-busy가 된다", () => {
    renderNotificationTable({ isFetching: true });

    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("link", { name: "첫 번째 알림" })).toBeInTheDocument();
  });

  it("행이 없으면 다시 불러오는 중이어도 aria-busy를 켜지 않는다", () => {
    renderNotificationTable({ notifications: [], isFetching: true });

    expect(screen.getByRole("table")).not.toHaveAttribute("aria-busy");
  });
});
