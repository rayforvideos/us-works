import { type ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import axios from "axios";

import { HttpClientProvider, useHttpClient } from ".";

describe("useHttpClient", () => {
  it("프로바이더가 넘긴 클라이언트를 돌려준다", () => {
    const client = axios.create();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <HttpClientProvider client={client}>{children}</HttpClientProvider>
    );

    const { result } = renderHook(() => useHttpClient(), { wrapper });

    expect(result.current).toBe(client);
  });

  it("프로바이더 밖에서 쓰면 오류를 던진다", () => {
    expect(() => renderHook(() => useHttpClient())).toThrow(
      "HttpClientProvider 안에서만 쓸 수 있습니다.",
    );
  });
});
