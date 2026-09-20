import { createHttpClient } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readCallParams, readLastCall } from "@/shared/config";

import { CONTENT_DETAIL_FIXTURE, CONTENT_FIXTURE, type ContentInput } from "../../model/content";
import { createContent, fetchContent, fetchContents, updateContent } from ".";

const LIST_RESPONSE = { contents: CONTENT_FIXTURE, total: 25, page: 1, limit: 10 };

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

    const result = await fetchContent(client, "136");

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

    await updateContent(client, "136", { ...CONTENT_INPUT, link_url: "" });

    expect(readLastCall(calls).method).toBe("put");
    expect(readLastCall(calls).url).toBe("/api/v1/contents/136");
    expect(readLastCall(calls).data).toBe(JSON.stringify({ ...CONTENT_INPUT, link_url: "" }));
  });
});
