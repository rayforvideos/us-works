import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { DRAFT_CONTENT_FIXTURE, PUBLISHED_CONTENT_FIXTURE } from "@/entities/content";
import { PENDING_NOTIFICATION_FIXTURE, SENT_NOTIFICATION_FIXTURE } from "@/entities/notification";
import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";
import {
  createFailResponse,
  createFakeAdapter,
  createOkResponse,
  type FakeResponse,
} from "@/shared/config";

import { AlarmWritePage } from ".";

const EDITED_NOTIFICATION = {
  ...PENDING_NOTIFICATION_FIXTURE,
  id: 12,
  scheduled_at: "2099-10-01T09:00:00+09:00",
};

const SENT_NOTIFICATION = { ...SENT_NOTIFICATION_FIXTURE, id: 12 };

function renderPage(pathname: string, respond: Parameters<typeof createFakeAdapter>[0]) {
  const { adapter, calls } = createFakeAdapter(respond);
  const router = createMemoryRouter(
    [
      { path: "/alarms/new", element: <AlarmWritePage /> },
      { path: "/alarms/:id", element: <AlarmWritePage /> },
      { path: "/alarms", element: <p>알람 목록</p> },
      { path: "/", element: <p>콘텐츠 목록</p> },
    ],
    { initialEntries: [pathname] },
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

function respondToCreate(notificationResponse: FakeResponse) {
  return (config: { url?: string }) =>
    config.url === "/api/v1/notifications"
      ? notificationResponse
      : createOkResponse(PUBLISHED_CONTENT_FIXTURE);
}

function respondToEdit(notification: unknown) {
  return () => createOkResponse(notification);
}

async function pickScheduledAt(date: string, time: string) {
  fireEvent.click(screen.getByRole("button", { name: "발송 시간" }));
  await screen.findByRole("dialog");
  fireEvent.change(screen.getByLabelText("발송 날짜"), { target: { value: date } });
  fireEvent.click(screen.getByRole("option", { name: time }));
}

async function fillForm() {
  fireEvent.change(screen.getByLabelText("제목"), { target: { value: "알림 제목" } });
  await pickScheduledAt("2099-12-31", "14:30");
}

function send() {
  fireEvent.click(screen.getByRole("button", { name: /발송하기/ }));
}

function goBack() {
  fireEvent.click(screen.getByRole("button", { name: "알람발송" }));
}

function readBody(data: unknown): Record<string, unknown> {
  return JSON.parse(String(data)) as Record<string, unknown>;
}

function readWrites(calls: { method?: string; url?: string; data?: unknown }[]) {
  return calls.filter((call) => call.method === "put" || call.method === "post");
}

describe("AlarmWritePage 작성", () => {
  it("S-03 Given 유효한 작성 폼(`?contentId=147`) When 발송하기를 누르면 Then `POST /api/v1/notifications`에 `content_id` 147을 보내고 성공하면 `/alarms`로 이동한다", async () => {
    const { calls } = renderPage(
      "/alarms/new?contentId=147",
      respondToCreate(createOkResponse(EDITED_NOTIFICATION, 201)),
    );

    await screen.findByLabelText("제목");
    await fillForm();
    send();

    expect(await screen.findByText("알람 목록")).toBeInTheDocument();
    expect(calls[0]?.url).toBe("/api/v1/contents/147");
    expect(calls[1]?.method).toBe("post");
    expect(calls[1]?.url).toBe("/api/v1/notifications");
    expect(readBody(calls[1]?.data)).toEqual({
      content_id: 147,
      title: "알림 제목",
      target_type: "all",
      scheduled_at: "2099-12-31T14:30:00+09:00",
    });
  });

  it('S-04 Given 서버가 409로 응답하면 When 발송하기 뒤 Then "이미 알림이 있는 콘텐츠입니다."가 보이고 입력값은 유지된다', async () => {
    renderPage(
      "/alarms/new?contentId=147",
      respondToCreate(createFailResponse(409, "content already has a notification")),
    );

    await screen.findByLabelText("제목");
    await fillForm();
    send();

    expect(await screen.findByRole("alert")).toHaveTextContent("이미 알림이 있는 콘텐츠입니다.");
    expect(screen.getByLabelText("제목")).toHaveValue("알림 제목");
    expect(screen.getByText("2099년 12월 31일 14시 30분")).toBeInTheDocument();
  });

  it("S-12 Given `/alarms/new`(contentId 없음) When 페이지가 열리면 Then `/`로 이동한다", async () => {
    const { router } = renderPage("/alarms/new", respondToCreate(createOkResponse(null, 201)));

    expect(await screen.findByText("콘텐츠 목록")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it('S-13 Given 비공개 콘텐츠의 `/alarms/new?contentId=147` When 페이지가 열리면 Then 폼 대신 비공개 안내와 "목록으로" 링크가 보인다', async () => {
    renderPage("/alarms/new?contentId=147", () => createOkResponse(DRAFT_CONTENT_FIXTURE));

    expect(
      await screen.findByText(
        "비공개 콘텐츠에는 알림을 보낼 수 없습니다. 콘텐츠를 먼저 공개하거나 예약해주세요.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
    expect(screen.queryByLabelText("제목")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /발송하기/ })).not.toBeInTheDocument();
  });

  it("작성 화면은 콘텐츠를 불러오는 동안 스피너를 보이고 실패하면 목록 링크를 보인다", async () => {
    renderPage("/alarms/new?contentId=147", () => createFailResponse(404, "not found"));

    expect(screen.getByRole("status", { name: "콘텐츠 불러오는 중" })).toBeInTheDocument();

    expect(await screen.findByText("요청한 내용을 찾을 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
  });
});

describe("AlarmWritePage 수정", () => {
  it("S-05 Given `/alarms/12` When 페이지가 열리면 Then `GET /api/v1/notifications/12` 값으로 폼이 채워진다", async () => {
    const { calls } = renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    expect(await screen.findByLabelText("제목")).toHaveValue("두 번째 알림");
    expect(calls[0]?.method).toBe("get");
    expect(calls[0]?.url).toBe("/api/v1/notifications/12");
    expect(screen.getByRole("radio", { name: "팔로워" })).toBeChecked();
    expect(screen.getByText("2099년 10월 01일 09시 00분")).toBeInTheDocument();
  });

  it("S-06 Given 발송 상태가 `sent`인 알림의 수정 화면 When 열리면 Then 입력이 비활성이고 발송하기 버튼이 없다", async () => {
    renderPage("/alarms/12", respondToEdit(SENT_NOTIFICATION));

    expect(await screen.findByLabelText("제목")).toBeDisabled();
    expect(screen.getByRole("button", { name: "발송 시간" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /발송하기/ })).not.toBeInTheDocument();
  });

  it("S-07 Given 제목만 바꾼 수정 폼 When 발송하기를 누르면 Then `PUT /api/v1/notifications/12`만 보내고 성공하면 `/alarms`로 이동한다", async () => {
    const { calls } = renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    await screen.findByLabelText("제목");
    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "바뀐 제목" } });
    send();

    expect(await screen.findByText("알람 목록")).toBeInTheDocument();
    const writes = readWrites(calls);
    expect(writes).toHaveLength(1);
    expect(writes[0]?.url).toBe("/api/v1/notifications/12");
    expect(readBody(writes[0]?.data)).toEqual({ title: "바뀐 제목", target_type: "follower" });
  });

  it("S-08 Given 시간만 바꾼 수정 폼 When 발송하기를 누르면 Then `PUT /api/v1/notifications/12/schedule`만 보낸다", async () => {
    const { calls } = renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    await screen.findByLabelText("제목");
    await pickScheduledAt("2099-10-01", "14:30");
    send();

    expect(await screen.findByText("알람 목록")).toBeInTheDocument();
    const writes = readWrites(calls);
    expect(writes).toHaveLength(1);
    expect(writes[0]?.url).toBe("/api/v1/notifications/12/schedule");
    expect(readBody(writes[0]?.data)).toEqual({ scheduled_at: "2099-10-01T14:30:00+09:00" });
  });

  it("수정 화면은 불러오는 동안 스피너를 보이고 실패하면 목록 링크를 보인다", async () => {
    renderPage("/alarms/12", () => createFailResponse(404, "not found"));

    expect(screen.getByRole("status", { name: "알림 불러오는 중" })).toBeInTheDocument();

    expect(await screen.findByText("요청한 내용을 찾을 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
  });
});

describe("AlarmWritePage 작성 종료", () => {
  it('S-09 Given 입력이 바뀐 폼 When 뒤로가기를 누르면 Then "작성을 종료하시겠습니까?" 모달이 보이고, 네를 누르면 `/alarms`로 이동한다', async () => {
    const { router } = renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    await screen.findByLabelText("제목");
    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "바뀐 제목" } });
    goBack();

    expect(
      await screen.findByRole("dialog", { name: "작성을 종료하시겠습니까?" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "네" }));

    expect(await screen.findByText("알람 목록")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/alarms");
  });

  it("S-10 Given 입력이 바뀐 폼의 종료 확인 모달 When 아니오를 누르면 Then 모달이 닫히고 입력값이 유지된다", async () => {
    renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    await screen.findByLabelText("제목");
    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "바뀐 제목" } });
    goBack();

    await screen.findByRole("dialog", { name: "작성을 종료하시겠습니까?" });
    fireEvent.click(screen.getByRole("button", { name: "아니오" }));

    await screen.findByLabelText("제목");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("제목")).toHaveValue("바뀐 제목");
  });

  it("S-11 Given 바뀐 게 없는 폼 When 뒤로가기를 누르면 Then 모달 없이 `/alarms`로 이동한다", async () => {
    const { router } = renderPage("/alarms/12", respondToEdit(EDITED_NOTIFICATION));

    await screen.findByLabelText("제목");
    goBack();

    expect(await screen.findByText("알람 목록")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/alarms");
  });
});
