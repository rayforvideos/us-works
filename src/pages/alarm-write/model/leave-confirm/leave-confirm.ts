/**
 * @constants
 */
export const LEAVE_ALLOWED_STATE = { leaveAllowed: true } as const;

export function isLeaveAllowed(state: unknown): boolean {
  if (typeof state !== "object" || state === null || !("leaveAllowed" in state)) {
    return false;
  }
  return state.leaveAllowed === true;
}
