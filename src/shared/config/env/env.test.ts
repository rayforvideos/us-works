import { readEnv } from "./env";

describe("readEnv", () => {
  it("VITE_API_BASE_URL을 apiBaseUrl로 돌려준다", () => {
    expect(readEnv().apiBaseUrl).toBe("http://api.test");
  });

  it("VITE_API_BASE_URL이 비어 있으면 오류를 던진다", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");

    expect(() => readEnv()).toThrow("VITE_API_BASE_URL");

    vi.unstubAllEnvs();
  });
});
