import { createTokenRefresher } from "./token-refresher";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createHandlers(result: Promise<boolean>) {
  const refreshAccessToken = vi.fn<() => Promise<boolean>>(() => result);
  const onUnauthorized = vi.fn<() => void>();
  return { refreshAccessToken, onUnauthorized };
}

describe("createTokenRefresher", () => {
  it("갱신 성공 시 true를 돌려주고 onUnauthorized를 호출하지 않는다", async () => {
    const handlers = createHandlers(Promise.resolve(true));
    const refresher = createTokenRefresher(handlers);

    await expect(refresher.refresh()).resolves.toBe(true);
    expect(handlers.onUnauthorized).not.toHaveBeenCalled();
  });

  it("갱신이 false를 돌려주면 onUnauthorized를 한 번 호출하고 false를 돌려준다", async () => {
    const handlers = createHandlers(Promise.resolve(false));
    const refresher = createTokenRefresher(handlers);

    await expect(refresher.refresh()).resolves.toBe(false);
    expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("갱신이 예외를 던지면 false로 처리하고 onUnauthorized를 한 번 호출한다", async () => {
    const handlers = createHandlers(Promise.reject(new Error("refresh down")));
    const refresher = createTokenRefresher(handlers);

    await expect(refresher.refresh()).resolves.toBe(false);
    expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("진행 중에 다시 호출하면 새 갱신을 시작하지 않고 같은 Promise를 돌려준다", async () => {
    const deferred = createDeferred<boolean>();
    const handlers = createHandlers(deferred.promise);
    const refresher = createTokenRefresher(handlers);

    const first = refresher.refresh();
    const second = refresher.refresh();
    const third = refresher.refresh();
    expect(handlers.refreshAccessToken).toHaveBeenCalledTimes(1);

    deferred.resolve(true);
    await expect(Promise.all([first, second, third])).resolves.toEqual([true, true, true]);
  });

  it("진행 중인 갱신은 getPending()으로 조회되고, 끝나면 null이다", async () => {
    const deferred = createDeferred<boolean>();
    const refresher = createTokenRefresher(createHandlers(deferred.promise));

    expect(refresher.getPending()).toBeNull();
    const inFlight = refresher.refresh();
    expect(refresher.getPending()).toBe(inFlight);

    deferred.resolve(true);
    await inFlight;
    expect(refresher.getPending()).toBeNull();
  });

  it("갱신이 끝난 뒤 다시 호출하면 새 갱신을 시작한다", async () => {
    const handlers = createHandlers(Promise.resolve(true));
    const refresher = createTokenRefresher(handlers);

    await refresher.refresh();
    await refresher.refresh();

    expect(handlers.refreshAccessToken).toHaveBeenCalledTimes(2);
  });

  it("동시 호출이 함께 실패해도 onUnauthorized는 한 번만 호출된다", async () => {
    const deferred = createDeferred<boolean>();
    const handlers = createHandlers(deferred.promise);
    const refresher = createTokenRefresher(handlers);

    const all = Promise.all([refresher.refresh(), refresher.refresh(), refresher.refresh()]);
    deferred.resolve(false);
    await expect(all).resolves.toEqual([false, false, false]);

    expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("실패 뒤에도 재시도 요청 실패를 notifyUnauthorized로 알리면 한 번만 전달되고, 성공 후에는 다시 알릴 수 있다", async () => {
    const handlers = createHandlers(Promise.resolve(true));
    const refresher = createTokenRefresher(handlers);

    refresher.notifyUnauthorized();
    refresher.notifyUnauthorized();
    expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);

    await refresher.refresh();
    refresher.notifyUnauthorized();
    expect(handlers.onUnauthorized).toHaveBeenCalledTimes(2);
  });
});
