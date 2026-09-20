import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { CONTENT_DETAIL_FIXTURE } from "@/entities/content";
import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";
import {
  createFailResponse,
  createFakeAdapter,
  createOkResponse,
  type FakeResponse,
} from "@/shared/config";

import { ContentWritePage } from ".";

const DRAFT_KEY = "us-works.content-draft";

const SAVED_DRAFT = {
  title: "임시저장 제목",
  body: "임시저장 내용",
  categories: ["realty"],
  linkUrl: "https://example.com",
  savedAt: "2026-09-20T07:41:00.000Z",
};

function renderPage(pathname: string, result: FakeResponse) {
  const { adapter, calls } = createFakeAdapter(() => result);
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

function fillForm() {
  fireEvent.click(screen.getByRole("checkbox", { name: "부동산" }));
  fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
  fireEvent.change(screen.getByLabelText("내용"), { target: { value: "내용" } });
}

function publish() {
  fireEvent.click(screen.getByRole("button", { name: /발행하기/ }));
}

function readStoredDraft(): Record<string, unknown> | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw === null ? null : (JSON.parse(raw) as Record<string, unknown>);
}

describe("ContentWritePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("S-06 Given 유효한 작성 폼 When 발행하기를 누르면 Then `POST /api/v1/contents`를 보내고 성공하면 임시저장을 지우고 `/`로 이동한다", async () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...SAVED_DRAFT, categories: [] }));
    const { calls } = renderPage("/contents/new", createOkResponse(CONTENT_DETAIL_FIXTURE, 201));

    fillForm();
    publish();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(calls).toHaveLength(1);
    expect(calls[0]?.method).toBe("post");
    expect(calls[0]?.url).toBe("/api/v1/contents");
    expect(readStoredDraft()).toBeNull();
  });

  it('S-07 Given 작성 폼에 입력한 상태 When 임시저장을 누르면 Then 로컬 스토리지에 저장되고 헤더에 "해당 글이 임시 저장되었습니다 HH:mm"이 보인다', () => {
    renderPage("/contents/new", createOkResponse(CONTENT_DETAIL_FIXTURE, 201));

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
    fireEvent.click(screen.getByRole("button", { name: "임시저장" }));

    expect(readStoredDraft()).toMatchObject({ title: "제목" });
    expect(screen.getByText(/해당 글이 임시 저장되었습니다 \d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("S-08 Given 작성 폼에 입력한 상태 When 30초가 지나면 Then 자동으로 임시저장된다", () => {
    vi.useFakeTimers();
    renderPage("/contents/new", createOkResponse(CONTENT_DETAIL_FIXTURE, 201));

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "제목" } });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(readStoredDraft()).toMatchObject({ title: "제목" });
    vi.useRealTimers();
  });

  it("S-09 Given 임시저장이 있는 상태 When `/contents/new`에 들어오면 Then 폼이 임시저장 값으로 채워진다", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(SAVED_DRAFT));
    renderPage("/contents/new", createOkResponse(CONTENT_DETAIL_FIXTURE, 201));

    expect(screen.getByLabelText("제목")).toHaveValue("임시저장 제목");
    expect(screen.getByLabelText("내용")).toHaveValue("임시저장 내용");
    expect(screen.getByRole("checkbox", { name: "부동산" })).toBeChecked();
    expect(screen.getByLabelText("삽입된 링크 주소")).toHaveValue("https://example.com");
  });

  it("S-10 Given `/contents/136` When 페이지가 열리면 Then `GET /api/v1/contents/136` 값으로 폼이 채워지고 임시저장 버튼이 없다", async () => {
    const { calls } = renderPage("/contents/136", createOkResponse(CONTENT_DETAIL_FIXTURE));

    expect(await screen.findByLabelText("제목")).toHaveValue(CONTENT_DETAIL_FIXTURE.title);
    expect(calls[0]?.method).toBe("get");
    expect(calls[0]?.url).toBe("/api/v1/contents/136");
    expect(screen.queryByRole("button", { name: "임시저장" })).not.toBeInTheDocument();
  });

  it("S-11 Given 수정 폼 When 발행하기를 누르면 Then `PUT /api/v1/contents/136`을 보내고 성공하면 `/`로 이동한다", async () => {
    const { calls } = renderPage("/contents/136", createOkResponse(CONTENT_DETAIL_FIXTURE));

    await screen.findByLabelText("제목");
    publish();

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(calls[1]?.method).toBe("put");
    expect(calls[1]?.url).toBe("/api/v1/contents/136");
  });

  it('S-12 Given 서버가 400으로 응답하면 When 발행하기 뒤 Then "입력값을 확인해주세요."가 보이고 입력값은 유지된다', async () => {
    renderPage("/contents/new", createFailResponse(400, "title: required"));

    fillForm();
    publish();

    expect(await screen.findByRole("alert")).toHaveTextContent("입력값을 확인해주세요.");
    expect(screen.getByLabelText("제목")).toHaveValue("제목");
  });

  it("S-13 Given 작성 페이지 When 뒤로가기(화살표·제목)를 누르면 Then `/`로 이동한다", async () => {
    const { router } = renderPage("/contents/new", createOkResponse(CONTENT_DETAIL_FIXTURE, 201));

    fireEvent.click(screen.getByRole("button", { name: "콘텐츠 쓰기" }));

    expect(await screen.findByText("목록")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("수정 화면은 불러오는 동안 스피너를 보이고 실패하면 목록 링크를 보인다", async () => {
    renderPage("/contents/136", createFailResponse(404, "not found"));

    expect(screen.getByRole("status", { name: "콘텐츠 불러오는 중" })).toBeInTheDocument();

    expect(await screen.findByText("요청한 내용을 찾을 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
  });
});
