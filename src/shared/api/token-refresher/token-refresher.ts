import { type TokenRefresher, type TokenRefreshHandlers } from "./types";

export function createTokenRefresher(handlers: TokenRefreshHandlers): TokenRefresher {
  let inFlight: Promise<boolean> | null = null;
  let hasNotifiedUnauthorized = false;

  function notifyUnauthorized() {
    if (hasNotifiedUnauthorized) {
      return;
    }
    hasNotifiedUnauthorized = true;
    handlers.onUnauthorized();
  }

  async function runRefresh(): Promise<boolean> {
    try {
      const isRefreshed = await handlers.refreshAccessToken();
      if (!isRefreshed) {
        notifyUnauthorized();
      }
      return isRefreshed;
    } catch {
      notifyUnauthorized();
      return false;
    } finally {
      inFlight = null;
    }
  }

  function refresh(): Promise<boolean> {
    if (!inFlight) {
      hasNotifiedUnauthorized = false;
      inFlight = runRefresh();
    }
    return inFlight;
  }

  return { refresh, getPending: () => inFlight, notifyUnauthorized };
}
