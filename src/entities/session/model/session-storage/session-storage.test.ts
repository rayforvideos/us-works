import { PERSISTED_SESSION_FIXTURE } from "@/shared/testing";

import { SESSION_STORAGE_KEY } from "./constants";
import { readPersistedSession, writePersistedSession } from "./session-storage";

describe("세션 저장소", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("저장된 세션을 그대로 돌려준다", () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(PERSISTED_SESSION_FIXTURE));

    expect(readPersistedSession()).toEqual(PERSISTED_SESSION_FIXTURE);
  });

  it("refresh 토큰이 만료됐으면 세션이 없는 것으로 보고 저장값을 지운다", () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        ...PERSISTED_SESSION_FIXTURE,
        refreshExpiresAt: "2020-01-01T00:00:00.000Z",
      }),
    );

    expect(readPersistedSession()).toBeNull();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("형식이 맞지 않는 저장값은 무시한다", () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ refreshToken: 7 }));
    expect(readPersistedSession()).toBeNull();

    localStorage.setItem(SESSION_STORAGE_KEY, "not json");
    expect(readPersistedSession()).toBeNull();
  });

  it("사용자 정보가 빠지거나 형이 다른 저장값은 무시한다", () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...PERSISTED_SESSION_FIXTURE, user: {} }),
    );
    expect(readPersistedSession()).toBeNull();

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        ...PERSISTED_SESSION_FIXTURE,
        user: { ...PERSISTED_SESSION_FIXTURE.user, id: "7" },
      }),
    );
    expect(readPersistedSession()).toBeNull();
  });

  it("저장소를 읽을 수 없으면 세션이 없는 것으로 본다", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    expect(readPersistedSession()).toBeNull();
    expect(getItem).toHaveBeenCalled();
  });

  it("저장소에 쓸 수 없어도 오류를 던지지 않는다", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    expect(() => {
      writePersistedSession(PERSISTED_SESSION_FIXTURE);
    }).not.toThrow();
    expect(setItem).toHaveBeenCalled();
  });

  it("null을 쓰면 저장값을 지운다", () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(PERSISTED_SESSION_FIXTURE));

    writePersistedSession(null);

    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });
});
