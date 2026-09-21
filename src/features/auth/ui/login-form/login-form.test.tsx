import { createMemoryRouter, type InitialEntry } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";

import { persistedSessionAtom } from "@/entities/session";
import { createHttpClient, createQueryClient, HttpClientProvider } from "@/shared/api";
import {
  AUTH_RESPONSE_FIXTURE,
  createFailResponse,
  createFakeAdapter,
  createOkResponse,
  type FakeResponse,
  PERSISTED_SESSION_FIXTURE,
} from "@/shared/testing";

import { LoginForm } from ".";

function renderLoginForm(result: FakeResponse, initialEntries: InitialEntry[] = ["/login"]) {
  const { adapter, calls } = createFakeAdapter(() => result);
  const store = createStore();
  const router = createMemoryRouter(
    [
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <p>회원가입 화면</p> },
      { path: "/", element: <p>홈 화면</p> },
      { path: "/contents/new", element: <p>새 콘텐츠 화면</p> },
    ],
    { initialEntries },
  );

  render(
    <QueryClientProvider client={createQueryClient({ queries: { retry: false } })}>
      <HttpClientProvider client={createHttpClient({ baseUrl: "http://api.test", adapter })}>
        <JotaiProvider store={store}>
          <RouterProvider router={router} />
        </JotaiProvider>
      </HttpClientProvider>
    </QueryClientProvider>,
  );

  return { router, store, calls };
}

function submitCredentials() {
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "user@example.com" } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "secret1" } });
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("S-01 Given 빈 폼 When 로그인을 누르면 Then 두 필드 아래 필수 오류가 보이고 요청을 보내지 않는다", () => {
    const { calls } = renderLoginForm(createOkResponse(AUTH_RESPONSE_FIXTURE));

    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("이메일을 입력해주세요.")).toBeInTheDocument();
    expect(screen.getByText("비밀번호를 입력해주세요.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(calls).toHaveLength(0);
  });

  it("S-02 Given 유효한 값 When 로그인을 누르면 Then 버튼이 로딩 상태가 되고 입력이 비활성이 된다", async () => {
    renderLoginForm("pending");

    submitCredentials();

    expect(await screen.findByRole("status", { name: "로딩 중" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인/ })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("이메일")).toBeDisabled();
    expect(screen.getByLabelText("비밀번호")).toBeDisabled();
  });

  it("S-03 Given 유효한 값 When 서버가 200으로 응답하면 Then 세션이 저장되고 `/`로 이동한다", async () => {
    const { router, store } = renderLoginForm(createOkResponse(AUTH_RESPONSE_FIXTURE));

    submitCredentials();

    expect(await screen.findByText("홈 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
    expect(store.get(persistedSessionAtom)).toEqual(PERSISTED_SESSION_FIXTURE);
  });

  it("S-04 Given 보호 경로 `/contents/new`에서 보내져 온 상태 When 로그인에 성공하면 Then `/contents/new`로 돌아간다", async () => {
    const { router } = renderLoginForm(createOkResponse(AUTH_RESPONSE_FIXTURE), [
      { pathname: "/login", state: { from: "/contents/new" } },
    ]);

    submitCredentials();

    expect(await screen.findByText("새 콘텐츠 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/contents/new");
  });

  it('S-05 Given 유효한 값 When 서버가 401로 응답하면 Then "이메일 또는 비밀번호가 올바르지 않습니다."가 보이고 입력값은 유지된다', async () => {
    renderLoginForm(createFailResponse(401, "invalid email or password"));

    submitCredentials();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
    expect(screen.getByLabelText("이메일")).toHaveValue("user@example.com");
    expect(screen.getByLabelText("비밀번호")).toHaveValue("secret1");
  });

  it('S-06 Given 로그인 페이지 When "회원가입" 링크를 누르면 Then `/register`로 이동한다', async () => {
    const { router } = renderLoginForm(createOkResponse(AUTH_RESPONSE_FIXTURE));

    fireEvent.click(screen.getByRole("link", { name: "회원가입" }));

    expect(await screen.findByText("회원가입 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/register");
  });

  it('Given state.from이 "//evil.example"인 상태 When 로그인에 성공하면 Then "/"로 이동한다', async () => {
    const { router } = renderLoginForm(createOkResponse(AUTH_RESPONSE_FIXTURE), [
      { pathname: "/login", state: { from: "//evil.example" } },
    ]);

    submitCredentials();

    expect(await screen.findByText("홈 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });
});
