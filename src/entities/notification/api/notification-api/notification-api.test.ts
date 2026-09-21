import { createHttpClient } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readCallParams, readLastCall } from "@/shared/config";

import {
  NOTIFICATION_FIXTURE,
  type NotificationInput,
  PENDING_NOTIFICATION_FIXTURE,
} from "../../model/notification";
import {
  createNotification,
  deleteNotification,
  fetchNotification,
  fetchNotifications,
  updateNotification,
  updateNotificationSchedule,
} from ".";

const LIST_RESPONSE = { notifications: NOTIFICATION_FIXTURE, total: 25, page: 1, limit: 10 };

const NOTIFICATION_INPUT: NotificationInput = {
  content_id: 147,
  title: "새 알림",
  target_type: "all",
  scheduled_at: "2026-12-20T10:00:00+09:00",
};

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

describe("fetchNotification", () => {
  it("상세 경로로 알림 하나를 불러온다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse(PENDING_NOTIFICATION_FIXTURE),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const result = await fetchNotification(client, 12);

    expect(readLastCall(calls).method).toBe("get");
    expect(readLastCall(calls).url).toBe("/api/v1/notifications/12");
    expect(result.title).toBe(PENDING_NOTIFICATION_FIXTURE.title);
  });
});

describe("createNotification", () => {
  it("알림 생성 요청을 목록 경로로 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse(PENDING_NOTIFICATION_FIXTURE, 201),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await createNotification(client, NOTIFICATION_INPUT);

    expect(readLastCall(calls).method).toBe("post");
    expect(readLastCall(calls).url).toBe("/api/v1/notifications");
    expect(JSON.parse(String(readLastCall(calls).data))).toEqual(NOTIFICATION_INPUT);
  });
});

describe("updateNotification", () => {
  it("제목과 대상자 수정 요청을 상세 경로로 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse(PENDING_NOTIFICATION_FIXTURE),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await updateNotification(client, 12, { title: "바뀐 제목", target_type: "follower" });

    expect(readLastCall(calls).method).toBe("put");
    expect(readLastCall(calls).url).toBe("/api/v1/notifications/12");
    expect(JSON.parse(String(readLastCall(calls).data))).toEqual({
      title: "바뀐 제목",
      target_type: "follower",
    });
  });
});

describe("updateNotificationSchedule", () => {
  it("발송 시각 수정 요청을 예약 경로로 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse(PENDING_NOTIFICATION_FIXTURE),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await updateNotificationSchedule(client, 12, { scheduled_at: "2026-12-20T10:00:00+09:00" });

    expect(readLastCall(calls).method).toBe("put");
    expect(readLastCall(calls).url).toBe("/api/v1/notifications/12/schedule");
    expect(JSON.parse(String(readLastCall(calls).data))).toEqual({
      scheduled_at: "2026-12-20T10:00:00+09:00",
    });
  });
});

describe("deleteNotification", () => {
  it("알림 삭제 요청을 상세 경로로 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await deleteNotification(client, 12);

    expect(readLastCall(calls).method).toBe("delete");
    expect(readLastCall(calls).url).toBe("/api/v1/notifications/12");
  });
});
