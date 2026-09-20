import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";

import { AUTH_RESPONSE_FIXTURE } from "@/shared/config";

import { useIsAuthenticated, useSetSession } from ".";

function SessionProbe() {
  const isAuthenticated = useIsAuthenticated();
  const setSession = useSetSession();

  return (
    <div>
      <p>{isAuthenticated ? "로그인됨" : "로그아웃됨"}</p>
      <button
        type="button"
        onClick={() => {
          setSession(AUTH_RESPONSE_FIXTURE);
        }}
      >
        세션 저장
      </button>
    </div>
  );
}

describe("세션 훅", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("세션을 저장하면 로그인 상태가 된다", () => {
    render(
      <JotaiProvider store={createStore()}>
        <SessionProbe />
      </JotaiProvider>,
    );

    expect(screen.getByText("로그아웃됨")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "세션 저장" }));

    expect(screen.getByText("로그인됨")).toBeInTheDocument();
  });
});
