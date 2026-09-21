import { createMemoryRouter } from "react-router";
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

import { RegisterForm } from ".";

function renderRegisterForm(result: FakeResponse) {
  const { adapter, calls } = createFakeAdapter(() => result);
  const store = createStore();
  const router = createMemoryRouter(
    [
      { path: "/register", element: <RegisterForm /> },
      { path: "/login", element: <p>로그인 화면</p> },
      { path: "/", element: <p>홈 화면</p> },
    ],
    { initialEntries: ["/register"] },
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
  fireEvent.click(screen.getByRole("button", { name: "회원가입" }));
}

describe("RegisterForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("S-01 Given 빈 폼 When 회원가입을 누르면 Then 두 필드 아래 필수 오류가 보이고 요청을 보내지 않는다", () => {
    const { calls } = renderRegisterForm(createOkResponse(AUTH_RESPONSE_FIXTURE, 201));

    fireEvent.click(screen.getByRole("button", { name: "회원가입" }));

    expect(screen.getByText("이메일을 입력해주세요.")).toBeInTheDocument();
    expect(screen.getByText("비밀번호를 입력해주세요.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(calls).toHaveLength(0);
  });

  it("S-02 Given 유효한 값 When 회원가입을 누르면 Then 버튼이 로딩 상태가 되고 입력이 비활성이 된다", async () => {
    renderRegisterForm("pending");

    submitCredentials();

    expect(await screen.findByRole("status", { name: "로딩 중" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /회원가입/ })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("이메일")).toBeDisabled();
    expect(screen.getByLabelText("비밀번호")).toBeDisabled();
  });

  it("S-03 Given 유효한 값 When 서버가 201로 응답하면 Then 세션이 저장되고 `/`로 이동한다", async () => {
    const { router, store } = renderRegisterForm(createOkResponse(AUTH_RESPONSE_FIXTURE, 201));

    submitCredentials();

    expect(await screen.findByText("홈 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
    expect(store.get(persistedSessionAtom)).toEqual(PERSISTED_SESSION_FIXTURE);
  });

  it('S-04 Given 유효한 값 When 서버가 409로 응답하면 Then "이미 가입된 이메일입니다."가 보이고 입력값은 유지된다', async () => {
    renderRegisterForm(createFailResponse(409, "email already registered"));

    submitCredentials();

    expect(await screen.findByRole("alert")).toHaveTextContent("이미 가입된 이메일입니다.");
    expect(screen.getByLabelText("이메일")).toHaveValue("user@example.com");
    expect(screen.getByLabelText("비밀번호")).toHaveValue("secret1");
  });

  it('S-05 Given 회원가입 페이지 When "로그인" 링크를 누르면 Then `/login`으로 이동한다', async () => {
    const { router } = renderRegisterForm(createOkResponse(AUTH_RESPONSE_FIXTURE, 201));

    fireEvent.click(screen.getByRole("link", { name: "로그인" }));

    expect(await screen.findByText("로그인 화면")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
  });
});
