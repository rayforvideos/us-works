import { createHttpClient } from "@/shared/api";
import { createFakeAdapter, createOkResponse, readCallParams, readLastCall } from "@/shared/config";

import { CONTENT_FIXTURE } from "../../model/content";
import { fetchContents } from ".";

const LIST_RESPONSE = { contents: CONTENT_FIXTURE, total: 25, page: 1, limit: 10 };

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
