/**
 * @constants
 */
export const ROUTES = {
  contents: "/",
  alarms: "/alarms",
  login: "/login",
  register: "/register",
  contentNew: "/contents/new",
  contentDetail: (id: number) => `/contents/${String(id)}`,
  contentDetailPattern: "/contents/:id",
  alarmNew: "/alarms/new",
  alarmNewForContent: (contentId: number) => `/alarms/new?contentId=${String(contentId)}`,
  alarmDetail: (id: number) => `/alarms/${String(id)}`,
} as const;
