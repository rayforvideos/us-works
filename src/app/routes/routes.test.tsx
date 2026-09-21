import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { render, screen } from "@testing-library/react";

import { PUBLISHED_CONTENT_FIXTURE } from "@/entities/content";
import { PENDING_NOTIFICATION_FIXTURE } from "@/entities/notification";
import { persistedSessionAtom } from "@/entities/session";
import { createFakeAdapter, createOkResponse, PERSISTED_SESSION_FIXTURE } from "@/shared/config";

import { AppProviders } from "../app-providers";
import { initializeSystem } from "../initialize-system";
import { routes } from "./routes";

function openRoute(pathname: string, { hasSession }: { hasSession: boolean }) {
  const { adapter } = createFakeAdapter((config) => {
    if (config.url === "/api/v1/notifications") {
      return createOkResponse({ notifications: [], total: 0, page: 1, limit: 10 });
    }
    if (config.url?.startsWith("/api/v1/notifications/")) {
      return createOkResponse(PENDING_NOTIFICATION_FIXTURE);
    }
    if (config.url?.startsWith("/api/v1/contents/")) {
      return createOkResponse(PUBLISHED_CONTENT_FIXTURE);
    }
    return createOkResponse({ contents: [], total: 0, page: 1, limit: 10 });
  });
  const system = initializeSystem({ adapter, queryClient: { queries: { retry: false } } });
  if (hasSession) {
    system.store.set(persistedSessionAtom, PERSISTED_SESSION_FIXTURE);
  }
  const router = createMemoryRouter(routes, { initialEntries: [pathname] });

  render(
    <AppProviders {...system}>
      <RouterProvider router={router} />
    </AppProviders>,
  );

  return router;
}

function readRedirectFrom(state: unknown): unknown {
  if (typeof state !== "object" || state === null || !("from" in state)) {
    return null;
  }
  return state.from;
}

describe("라우터 보호", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("26 S-07 Given 세션이 있는 상태 When `/login`에 접근하면 Then `/`로 이동한다", async () => {
    const router = openRoute("/login", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("26 S-08 Given 세션이 없는 상태 When 보호 경로에 접근하면 Then `/login`으로 이동한다", async () => {
    const router = openRoute("/", { hasSession: false });

    expect(await screen.findByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
    expect(readRedirectFrom(router.state.location.state)).toBe("/");
  });

  it("26 S-06 Given 세션이 있는 상태 When `/register`에 접근하면 Then `/`로 이동한다", async () => {
    const router = openRoute("/register", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("세션이 있으면 /alarms에서 알람 목록 헤딩이 보인다", async () => {
    const router = openRoute("/alarms", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "알람" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/alarms");
  });

  it("세션이 있으면 /contents/new에서 콘텐츠 쓰기 헤딩이 보인다", async () => {
    const router = openRoute("/contents/new", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "콘텐츠 쓰기" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/contents/new");
  });

  it("세션이 있으면 /alarms/new에서 알람발송 헤딩이 보인다", async () => {
    const router = openRoute("/alarms/new?contentId=147", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "알람발송" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/alarms/new");
  });

  it("세션이 있으면 /alarms/12에서 알람발송 헤딩이 보인다", async () => {
    const router = openRoute("/alarms/12", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "알람발송" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/alarms/12");
  });

  it('알 수 없는 경로는 "/"로 보낸다', async () => {
    const router = openRoute("/없는-경로", { hasSession: true });

    expect(await screen.findByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it('세션이 없으면 알 수 없는 경로도 "/login"으로 보낸다', async () => {
    const router = openRoute("/없는-경로", { hasSession: false });

    expect(await screen.findByRole("heading", { name: "US Alliance" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
  });
});
