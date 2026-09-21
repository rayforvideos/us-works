/**
 * @constants
 */
export const ROUTES = {
  contents: "/",
  alarms: "/alarms",
  login: "/login",
  register: "/register",
  contentNew: "/contents/new",
  contentDetail: (id: number) => `/contents/${id}`,
  contentDetailPattern: "/contents/:id",
  alarmNew: "/alarms/new",
  alarmNewForContent: (contentId: number) => `/alarms/new?contentId=${contentId}`,
  alarmDetail: (id: number) => `/alarms/${id}`,
  alarmDetailPattern: "/alarms/:id",
} as const;
