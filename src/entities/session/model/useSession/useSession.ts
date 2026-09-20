import { useAtomValue, useStore } from "jotai";

import { type AuthResponse } from "../../api/session-api";
import { isAuthenticatedAtom, setSessionFromAuthResponse } from "../session";

export function useIsAuthenticated(): boolean {
  return useAtomValue(isAuthenticatedAtom);
}

export function useSetSession(): (data: AuthResponse) => void {
  const store = useStore();

  return (data: AuthResponse) => {
    setSessionFromAuthResponse(store, data);
  };
}
