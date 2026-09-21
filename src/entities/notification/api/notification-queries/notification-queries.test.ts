import { type AxiosInstance } from "axios";

import { notificationQueries } from "./notification-queries";

const CLIENT = {} as AxiosInstance;

describe("notificationQueries", () => {
  it("키는 [엔티티, 동작, 파라미터] 모양이다", () => {
    expect(notificationQueries.list(CLIENT, { page: 1, limit: 10 }).queryKey).toEqual([
      "notifications",
      "list",
      { page: 1, limit: 10 },
    ]);
    expect(notificationQueries.detail(CLIENT, 12).queryKey).toEqual([
      "notifications",
      "detail",
      12,
    ]);
  });

  it("무효화 단위는 조회 키의 접두사다", () => {
    const list = notificationQueries.list(CLIENT, { page: 1, limit: 10 }).queryKey;
    const detail = notificationQueries.detail(CLIENT, 12).queryKey;

    expect(list.slice(0, 1)).toEqual(notificationQueries.all());
    expect(list.slice(0, 2)).toEqual(notificationQueries.lists());
    expect(detail.slice(0, 2)).toEqual(notificationQueries.details());
  });
});
