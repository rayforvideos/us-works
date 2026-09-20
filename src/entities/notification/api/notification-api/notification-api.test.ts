import { createHttpClient } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readCallParams, readLastCall } from "@/shared/config";

import { NOTIFICATION_FIXTURE } from "../../model/notification";
import { fetchNotifications } from ".";

const LIST_RESPONSE = { notifications: NOTIFICATION_FIXTURE, total: 25, page: 1, limit: 10 };

describe("fetchNotifications", () => {
  it("목록 경로로 페이지와 개수를 쿼리에 담아 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(LIST_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await fetchNotifications(client, { page: 2, limit: 10 });

    expect(readLastCall(calls).url).toBe("/api/v1/notifications");
    expect(client.getUri({ url: readLastCall(calls).url, params: readCallParams(calls) })).toBe(
      "http://api.test/api/v1/notifications?page=2&limit=10",
    );
  });

  it("공통 응답 형식을 벗겨 목록 데이터를 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => createOkResponse(LIST_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const result = await fetchNotifications(client, { page: 1, limit: 10 });

    expect(result.total).toBe(25);
    expect(result.notifications).toHaveLength(NOTIFICATION_FIXTURE.length);
  });
});
