import { type AxiosInstance } from "axios";

import { contentQueries } from "./content-queries";

const CLIENT = {} as AxiosInstance;

describe("contentQueries", () => {
  it("키는 [엔티티, 동작, 파라미터] 모양이다", () => {
    expect(contentQueries.list(CLIENT, { page: 1, limit: 10 }).queryKey).toEqual([
      "contents",
      "list",
      { page: 1, limit: 10 },
    ]);
    expect(contentQueries.detail(CLIENT, "136").queryKey).toEqual(["contents", "detail", "136"]);
    expect(contentQueries.notification(CLIENT, "136").queryKey).toEqual([
      "contents",
      "notification",
      "136",
    ]);
  });

  it("무효화 단위는 조회 키의 접두사다", () => {
    const list = contentQueries.list(CLIENT, { page: 1, limit: 10 }).queryKey;
    const detail = contentQueries.detail(CLIENT, "136").queryKey;

    expect(list.slice(0, 1)).toEqual(contentQueries.all());
    expect(list.slice(0, 2)).toEqual(contentQueries.lists());
    expect(detail.slice(0, 2)).toEqual(contentQueries.details());
  });
});
