import { createHttpClient } from "@/shared/api";
import {
  createFailResponse,
  createFakeAdapter,
  createOkResponse,
  readCallParams,
  readLastCall,
} from "@/shared/testing";

import { CONTENT_DETAIL_FIXTURE, CONTENT_FIXTURE, type ContentInput } from "../../model/content";
import {
  changeContentStatus,
  createContent,
  deleteContentSchedule,
  fetchContent,
  fetchContentNotification,
  fetchContents,
  scheduleContent,
  updateContent,
  updateContentSchedule,
} from ".";

const LIST_RESPONSE = { contents: CONTENT_FIXTURE, total: 25, page: 1, limit: 10 };

const NOTIFICATION_RESPONSE = { id: 12, content_id: 136, title: "알림 제목" };

const CONTENT_INPUT: ContentInput = {
  title: "새 콘텐츠",
  body: "새 본문",
  categories: ["realty"],
  link_url: "https://example.com",
};

describe("fetchContents", () => {
  it("목록 경로로 페이지와 필터를 쿼리에 담아 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(LIST_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await fetchContents(client, {
      page: 2,
      limit: 10,
      category: "realty",
      publishStatus: "published",
    });

    expect(readLastCall(calls).url).toBe("/api/v1/contents");
    expect(client.getUri({ url: readLastCall(calls).url, params: readCallParams(calls) })).toBe(
      "http://api.test/api/v1/contents?page=2&limit=10&category=realty&publish_status=published",
    );
  });

  it("필터가 없으면 쿼리에서 뺀다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(LIST_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await fetchContents(client, { page: 1, limit: 10 });

    expect(client.getUri({ url: readLastCall(calls).url, params: readCallParams(calls) })).toBe(
      "http://api.test/api/v1/contents?page=1&limit=10",
    );
  });

  it("공통 응답 형식을 벗겨 목록 데이터를 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => createOkResponse(LIST_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const result = await fetchContents(client, { page: 1, limit: 10 });

    expect(result.total).toBe(25);
    expect(result.contents).toHaveLength(CONTENT_FIXTURE.length);
  });
});

describe("fetchContent", () => {
  it("콘텐츠 번호로 상세 경로에 GET 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const result = await fetchContent(client, 136);

    expect(readLastCall(calls).method).toBe("get");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136");
    expect(result.id).toBe(CONTENT_DETAIL_FIXTURE.id);
  });
});

describe("createContent", () => {
  it("콘텐츠 목록 경로에 입력값을 본문으로 담아 POST 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse(CONTENT_DETAIL_FIXTURE, 201),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await createContent(client, CONTENT_INPUT);

    expect(readLastCall(calls).method).toBe("post");
    expect(readLastCall(calls).url).toBe("/api/v1/contents");
    expect(readLastCall(calls).data).toBe(JSON.stringify(CONTENT_INPUT));
  });
});

describe("updateContent", () => {
  it("콘텐츠 상세 경로에 입력값을 본문으로 담아 PUT 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await updateContent(client, 136, { ...CONTENT_INPUT, link_url: "" });

    expect(readLastCall(calls).method).toBe("put");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136");
    expect(readLastCall(calls).data).toBe(JSON.stringify({ ...CONTENT_INPUT, link_url: "" }));
  });
});

describe("changeContentStatus", () => {
  it("공개 상태 경로에 상태를 본문으로 담아 PATCH 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await changeContentStatus(client, 136, "private");

    expect(readLastCall(calls).method).toBe("patch");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136/status");
    expect(readLastCall(calls).data).toBe(JSON.stringify({ status: "private" }));
  });
});

describe("scheduleContent", () => {
  it("예약 경로에 예약 시각을 본문으로 담아 POST 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await scheduleContent(client, 136, { published_at: "2027-04-05T14:35:00+09:00" });

    expect(readLastCall(calls).method).toBe("post");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136/schedule");
    expect(readLastCall(calls).data).toBe(
      JSON.stringify({ published_at: "2027-04-05T14:35:00+09:00" }),
    );
  });
});

describe("updateContentSchedule", () => {
  it("예약 경로에 바뀐 예약 시각을 본문으로 담아 PUT 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await updateContentSchedule(client, 136, { published_at: "2027-04-06T09:00:00+09:00" });

    expect(readLastCall(calls).method).toBe("put");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136/schedule");
    expect(readLastCall(calls).data).toBe(
      JSON.stringify({ published_at: "2027-04-06T09:00:00+09:00" }),
    );
  });
});

describe("deleteContentSchedule", () => {
  it("예약 경로에 DELETE 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() =>
      createOkResponse({ content_id: 136, is_scheduled: false }),
    );
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await deleteContentSchedule(client, 136);

    expect(readLastCall(calls).method).toBe("delete");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136/schedule");
  });
});

describe("fetchContentNotification", () => {
  it("콘텐츠의 알림 경로로 GET 요청을 보낸다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(NOTIFICATION_RESPONSE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    const result = await fetchContentNotification(client, 136);

    expect(readLastCall(calls).method).toBe("get");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136/notification");
    expect(result?.id).toBe(NOTIFICATION_RESPONSE.id);
  });

  it("취소 신호를 넘기면 요청 설정에 그대로 실린다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });
    const controller = new AbortController();

    await fetchContent(client, 136, { signal: controller.signal });

    expect(readLastCall(calls).signal).toBe(controller.signal);
  });

  it("이미 취소된 신호를 넘기면 요청을 보내지 않고 취소 오류가 된다", async () => {
    const { adapter, calls } = createFakeAdapter(() => createOkResponse(CONTENT_DETAIL_FIXTURE));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });
    const controller = new AbortController();
    controller.abort();

    await expect(fetchContent(client, 136, { signal: controller.signal })).rejects.toMatchObject({
      kind: "canceled",
    });
    expect(calls).toHaveLength(0);
  });

  it("알림이 없으면 서버가 빈 값을 주고 null을 돌려준다", async () => {
    const { adapter } = createFakeAdapter(() => createOkResponse(null));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await expect(fetchContentNotification(client, 136)).resolves.toBeNull();
  });

  it("없는 콘텐츠의 알림을 조회하면 오류를 던진다", async () => {
    const { adapter } = createFakeAdapter(() => createFailResponse(404, "content not found"));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await expect(fetchContentNotification(client, 999)).rejects.toThrow();
  });

  it("알림 조회가 다른 이유로 실패하면 오류를 그대로 던진다", async () => {
    const { adapter } = createFakeAdapter(() => createFailResponse(500, "server error"));
    const client = createHttpClient({ baseUrl: "http://api.test", adapter });

    await expect(fetchContentNotification(client, 136)).rejects.toThrow();
  });
});
