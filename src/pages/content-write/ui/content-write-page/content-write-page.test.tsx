import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { type InternalAxiosRequestConfig } from "axios";

import {
  CONTENT_DETAIL_FIXTURE,
  DRAFT_CONTENT_FIXTURE,
  PUBLISHED_CONTENT_FIXTURE,
  SCHEDULED_CONTENT_FIXTURE,
} from "@/entities/content";
import { PENDING_NOTIFICATION_FIXTURE } from "@/entities/notification";
import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";
import {
  createFailResponse,
  createFakeAdapter,
  createOkResponse,
  type FakeResponse,
} from "@/shared/config";

import { ContentWritePage } from ".";

/**
 * @types
 */
type FakeRoute = FakeResponse | (() => FakeResponse);

/**
 * @constants
 */
const DRAFT_KEY = "us-works.content-draft";

const SAVED_DRAFT = {
  title: "임시저장 제목",
  body: "임시저장 내용",
  categories: ["realty"],
  linkUrl: "https://example.com",
  savedAt: "2026-09-20T07:41:00.000Z",
};

const SCHEDULED_CONTENT = { ...SCHEDULED_CONTENT_FIXTURE, id: 136 };

const CONTENT_NOTIFICATION = { ...PENDING_NOTIFICATION_FIXTURE, content_id: 136 };

const NOT_FOUND_NOTIFICATION = createFailResponse(404, "notification not found");

const CREATED_CONTENT = { ...DRAFT_CONTENT_FIXTURE, id: 136 };

const PUBLIC_CONTENT = { ...PUBLISHED_CONTENT_FIXTURE, id: 136 };

const CREATE_ROUTES: Record<string, FakeRoute> = {
  "post /api/v1/contents": createOkResponse(CREATED_CONTENT),
  "get /api/v1/contents/136": createOkResponse(CREATED_CONTENT),
  "get /api/v1/contents/136/notification": NOT_FOUND_NOTIFICATION,
};

function renderPage(pathname: string, routes: Record<string, FakeRoute> = {}) {
  const { adapter, calls } = createFakeAdapter((config: InternalAxiosRequestConfig) => {
    const key = `${String(config.method)} ${String(config.url)}`;
    const route = routes[key];
    if (typeof route === "function") {
      return route();
    }
    return route ?? createOkResponse(CONTENT_DETAIL_FIXTURE);
  });
  const router = createMemoryRouter(
    [
      { path: "/contents/new", element: <ContentWritePage /> },
      { path: "/contents/:id", element: <ContentWritePage /> },
      { path: "/", element: <p>목록</p> },
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

function readCalls(calls: InternalAxiosRequestConfig[]): string[] {
  return calls.map((call) => `${String(call.method)} ${String(call.url)}`);
}

function readWrites(calls: InternalAxiosRequestConfig[]): string[] {
  return readCalls(calls).filter((call) => !call.startsWith("get "));
}

function readPublishCalls(calls: InternalAxiosRequestConfig[], count: number): string[] {
  const all = readCalls(calls);
  const start = all.findIndex((call) => !call.startsWith("get "));
  return start === -1 ? [] : all.slice(start, start + count);
}

function sortSlice(calls: string[], start: number, end: number): string[] {
  return [...calls.slice(start, end)].sort();
}

function readBody(calls: InternalAxiosRequestConfig[], key: string): Record<string, unknown> {
  const call = calls.find((item) => `${String(item.method)} ${String(item.url)}` === key);
  return JSON.parse(String(call?.data)) as Record<string, unknown>;
}

function fillForm() {
  fireEvent.click(screen.getByRole("checkbox", { name: "부동산" }));
  fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
  fireEvent.change(screen.getByLabelText("내용"), { target: { value: "내용" } });
}

function openPublishOptions() {
  fireEvent.click(within(screen.getByRole("banner")).getByRole("button", { name: /발행하기/ }));
}

function submitPublishOptions() {
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: /발행하기/ }));
}

function fillNotificationTitle(value: string) {
  fireEvent.change(screen.getByLabelText("알람 내용"), { target: { value } });
}

function fillPublishedAt(value: string) {
  fireEvent.change(
    screen.getByLabelText("예약 발행", { selector: "input[type='datetime-local']" }),
    {
      target: { value },
    },
  );
}

function readStoredDraft(): Record<string, unknown> | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw === null ? null : (JSON.parse(raw) as Record<string, unknown>);
}

describe("ContentWritePage 작성", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("43 S-01 Given 작성 페이지의 유효한 폼 When 발행하기를 누르면 Then 발행 옵션 모달이 공개·발송·전체 기본값으로 열린다", async () => {
    renderPage("/contents/new");

    fillForm();
    openPublishOptions();

    expect(await screen.findByRole("dialog", { name: "발행하기" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "공개" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "발송" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "전체" })).toBeChecked();
  });

  it("S-15 Given 작성 페이지의 빈 폼 When 발행하기를 누르면 Then 모달이 열리지 않고 폼 오류가 보인다", () => {
    renderPage("/contents/new");

    openPublishOptions();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("카테고리를 1개 이상 선택해주세요.")).toBeInTheDocument();
    expect(screen.getByText("제목을 입력해주세요.")).toBeInTheDocument();
    expect(screen.getByText("내용을 입력해주세요.")).toBeInTheDocument();
  });

  it("43 S-06 Given 작성 폼에서 공개·발송 When 발행하기를 누르면 Then `POST /contents` → `PATCH status public` → `POST /notifications`(`scheduled_at` 없음) 순으로 보내고 `/`로 이동한다", async () => {
    const { calls } = renderPage("/contents/new", CREATE_ROUTES);

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fillNotificationTitle("알람 내용");
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(readPublishCalls(calls, 4)).toEqual([
      "post /api/v1/contents",
      "get /api/v1/contents/136",
      "patch /api/v1/contents/136/status",
      "post /api/v1/notifications",
    ]);
    expect(readBody(calls, "patch /api/v1/contents/136/status")).toEqual({ status: "public" });
    expect(readBody(calls, "post /api/v1/notifications")).toEqual({
      content_id: 136,
      title: "알람 내용",
      target_type: "all",
    });
  });

  it("43 S-07 Given 작성 폼에서 예약 발행 2027-04-05 14:30·발송 When 발행하기를 누르면 Then `POST /contents` → `POST /contents/{id}/schedule` → `POST /notifications`(`scheduled_at` 2027-04-05T14:30:00+09:00)를 보낸다", async () => {
    const { calls } = renderPage("/contents/new", CREATE_ROUTES);

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "예약 발행" }));
    fillPublishedAt("2027-04-05T14:30");
    fillNotificationTitle("알람 내용");
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(readPublishCalls(calls, 4)).toEqual([
      "post /api/v1/contents",
      "get /api/v1/contents/136",
      "post /api/v1/contents/136/schedule",
      "post /api/v1/notifications",
    ]);
    expect(readBody(calls, "post /api/v1/contents/136/schedule")).toEqual({
      published_at: "2027-04-05T14:30:00+09:00",
    });
    expect(readBody(calls, "post /api/v1/notifications")).toEqual({
      content_id: 136,
      title: "알람 내용",
      target_type: "all",
      scheduled_at: "2027-04-05T14:30:00+09:00",
    });
  });

  it("43 S-08 Given 작성 폼에서 비공개 When 발행하기를 누르면 Then `POST /contents` 뒤 상태·알림 요청 없이 `/`로 이동한다", async () => {
    const { calls } = renderPage("/contents/new", CREATE_ROUTES);

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "비공개" }));
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(readPublishCalls(calls, 2)).toEqual([
      "post /api/v1/contents",
      "get /api/v1/contents/136",
    ]);
    expect(readWrites(calls)).toEqual(["post /api/v1/contents"]);
  });

  it("43 S-12 Given 상태 변경이 400으로 실패하면 When 발행하기 뒤 Then 모달에 오류 문구가 보이고 값이 유지된다", async () => {
    renderPage("/contents/new", {
      ...CREATE_ROUTES,
      "patch /api/v1/contents/136/status": createFailResponse(400, "invalid status"),
    });

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fillNotificationTitle("알람 내용");
    submitPublishOptions();

    expect(await screen.findByRole("alert")).toHaveTextContent("입력값을 확인해주세요.");
    expect(screen.getByLabelText("알람 내용")).toHaveValue("알람 내용");
  });

  it("이미 저장된 콘텐츠는 다시 시도할 때 `PUT`으로 저장한다", async () => {
    const { calls } = renderPage("/contents/new", {
      ...CREATE_ROUTES,
      "patch /api/v1/contents/136/status": createFailResponse(400, "invalid status"),
    });

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fillNotificationTitle("알람 내용");
    submitPublishOptions();
    await screen.findByRole("alert");
    submitPublishOptions();

    await waitFor(() => {
      expect(readWrites(calls)).toContain("put /api/v1/contents/136");
    });
  });

  it("부분 실패 뒤 다시 발행하면 서버의 최신 상태로 계획을 세워 이미 반영된 단계는 보내지 않는다", async () => {
    let isPublished = false;
    const { calls } = renderPage("/contents/new", {
      ...CREATE_ROUTES,
      "get /api/v1/contents/136": () =>
        createOkResponse(isPublished ? PUBLIC_CONTENT : CREATED_CONTENT),
      "patch /api/v1/contents/136/status": () => {
        isPublished = true;
        return createOkResponse(PUBLIC_CONTENT);
      },
      "post /api/v1/notifications": createFailResponse(400, "invalid notification"),
    });

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fillNotificationTitle("알람 내용");
    submitPublishOptions();
    await screen.findByRole("alert");
    submitPublishOptions();

    await waitFor(() => {
      expect(readWrites(calls)).toEqual([
        "post /api/v1/contents",
        "patch /api/v1/contents/136/status",
        "post /api/v1/notifications",
        "put /api/v1/contents/136",
        "post /api/v1/notifications",
      ]);
    });
  });

  it("43 S-13 Given 모달 When 취소를 누르면 Then 모달이 닫히고 작성 페이지 값은 유지된다", async () => {
    renderPage("/contents/new");

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("제목")).toHaveValue("제목");
    expect(screen.getByLabelText("내용")).toHaveValue("내용");
  });
});

describe("ContentWritePage 수정", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("43 S-09 Given 예약된 콘텐츠의 수정 화면 When 모달을 열면 Then 예약 발행과 예약 시각, 기존 알림 값이 채워져 있다", async () => {
    renderPage("/contents/136", {
      "get /api/v1/contents/136": createOkResponse(SCHEDULED_CONTENT),
      "get /api/v1/contents/136/notification": createOkResponse(CONTENT_NOTIFICATION),
    });

    await screen.findByLabelText("제목");
    openPublishOptions();

    expect(await screen.findByRole("dialog", { name: "발행하기" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "예약 발행" })).toBeChecked();
    expect(screen.getByText("2026년 10월 01일 09시 00분")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "팔로워" })).toBeChecked();
    expect(screen.getByLabelText("알람 내용")).toHaveValue("두 번째 알림");
  });

  it("43 S-10 Given 예약된 콘텐츠 When 비공개로 바꿔 발행하면 Then `PUT /contents/{id}` → `DELETE schedule` → `PATCH private` → 기존 알림 `DELETE`를 보낸다", async () => {
    const { calls } = renderPage("/contents/136", {
      "get /api/v1/contents/136": createOkResponse(SCHEDULED_CONTENT),
      "get /api/v1/contents/136/notification": createOkResponse(CONTENT_NOTIFICATION),
    });

    await screen.findByLabelText("제목");
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "비공개" }));
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    const publishCalls = readPublishCalls(calls, 6);
    expect(publishCalls[0]).toBe("put /api/v1/contents/136");
    expect(sortSlice(publishCalls, 1, 3)).toEqual([
      "get /api/v1/contents/136",
      "get /api/v1/contents/136/notification",
    ]);
    expect(publishCalls.slice(3)).toEqual([
      "delete /api/v1/contents/136/schedule",
      "patch /api/v1/contents/136/status",
      `delete /api/v1/notifications/${String(CONTENT_NOTIFICATION.id)}`,
    ]);
    expect(readBody(calls, "patch /api/v1/contents/136/status")).toEqual({ status: "private" });
  });

  it("43 S-11 Given 한 번 공개된 콘텐츠의 수정 화면 When 모달을 열면 Then 예약 발행이 비활성이다", async () => {
    renderPage("/contents/136", {
      "get /api/v1/contents/136": createOkResponse({ ...PUBLISHED_CONTENT_FIXTURE, id: 136 }),
      "get /api/v1/contents/136/notification": NOT_FOUND_NOTIFICATION,
    });

    await screen.findByLabelText("제목");
    openPublishOptions();

    expect(await screen.findByRole("dialog", { name: "발행하기" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "예약 발행" })).toBeDisabled();
  });
});

describe("ContentWritePage 콘텐츠 저장", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("35 S-06 Given 유효한 작성 폼 When 발행하기를 누르면 Then 발행 옵션 모달이 열리고 모달에서 발행하면 임시저장을 지우고 `/`로 이동한다", async () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...SAVED_DRAFT, categories: [] }));
    const { calls } = renderPage("/contents/new", CREATE_ROUTES);

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "비공개" }));
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(readWrites(calls)).toEqual(["post /api/v1/contents"]);
    expect(readStoredDraft()).toBeNull();
  });

  it('35 S-07 Given 작성 폼에 입력한 상태 When 임시저장을 누르면 Then 로컬 스토리지에 저장되고 헤더에 "해당 글이 임시 저장되었습니다 HH:mm"이 보인다', () => {
    renderPage("/contents/new");

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
    fireEvent.click(screen.getByRole("button", { name: "임시저장" }));

    expect(readStoredDraft()).toMatchObject({ title: "제목" });
    expect(screen.getByText(/해당 글이 임시 저장되었습니다 \d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("35 S-08 Given 작성 폼에 입력한 상태 When 30초가 지나면 Then 자동으로 임시저장된다", () => {
    vi.useFakeTimers();
    renderPage("/contents/new");

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(readStoredDraft()).toMatchObject({ title: "제목" });
    vi.useRealTimers();
  });

  it("35 S-09 Given 임시저장이 있는 상태 When `/contents/new`에 들어오면 Then 폼이 임시저장 값으로 채워진다", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(SAVED_DRAFT));
    renderPage("/contents/new");

    expect(screen.getByLabelText("제목")).toHaveValue("임시저장 제목");
    expect(screen.getByLabelText("내용")).toHaveValue("임시저장 내용");
    expect(screen.getByRole("checkbox", { name: "부동산" })).toBeChecked();
    expect(screen.getByLabelText("삽입된 링크 주소")).toHaveValue("https://example.com");
  });

  it("35 S-10 Given `/contents/136` When 페이지가 열리면 Then `GET /api/v1/contents/136` 값으로 폼이 채워지고 임시저장 버튼이 없다", async () => {
    const { calls } = renderPage("/contents/136", {
      "get /api/v1/contents/136/notification": NOT_FOUND_NOTIFICATION,
    });

    expect(await screen.findByLabelText("제목")).toHaveValue(CONTENT_DETAIL_FIXTURE.title);
    expect(readCalls(calls)).toContain("get /api/v1/contents/136");
    expect(screen.queryByRole("button", { name: "임시저장" })).not.toBeInTheDocument();
  });

  it("35 S-11 Given 수정 폼 When 모달에서 발행하기를 누르면 Then `PUT /api/v1/contents/136`을 보내고 성공하면 `/`로 이동한다", async () => {
    const { calls } = renderPage("/contents/136", {
      "get /api/v1/contents/136/notification": NOT_FOUND_NOTIFICATION,
    });

    await screen.findByLabelText("제목");
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "비공개" }));
    submitPublishOptions();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(readWrites(calls)).toEqual([
      "put /api/v1/contents/136",
      "patch /api/v1/contents/136/status",
    ]);
  });

  it('35 S-12 Given 서버가 400으로 응답하면 When 발행하기 뒤 Then "입력값을 확인해주세요."가 보이고 입력값은 유지된다', async () => {
    renderPage("/contents/new", {
      "post /api/v1/contents": createFailResponse(400, "title: required"),
    });

    fillForm();
    openPublishOptions();
    await screen.findByRole("dialog", { name: "발행하기" });
    fireEvent.click(screen.getByRole("radio", { name: "비공개" }));
    submitPublishOptions();

    expect(await screen.findByRole("alert")).toHaveTextContent("입력값을 확인해주세요.");
    expect(screen.getByLabelText("제목")).toHaveValue("제목");
  });

  it("35 S-13 Given 작성 페이지 When 뒤로가기(화살표·제목)를 누르면 Then `/`로 이동한다", async () => {
    const { router } = renderPage("/contents/new");

    fireEvent.click(screen.getByRole("button", { name: "콘텐츠 쓰기" }));

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("수정 화면은 불러오는 동안 스피너를 보이고 실패하면 목록 링크를 보인다", async () => {
    renderPage("/contents/136", {
      "get /api/v1/contents/136": createFailResponse(404, "not found"),
      "get /api/v1/contents/136/notification": NOT_FOUND_NOTIFICATION,
    });

    expect(screen.getByRole("status", { name: "콘텐츠 불러오는 중" })).toBeInTheDocument();

    expect(await screen.findByText("요청한 내용을 찾을 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
  });
});
