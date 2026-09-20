import { publishOptionsSchema } from ".";
import { type PublishOptionsValues } from "./types";

const VALID_VALUES: PublishOptionsValues = {
  visibility: "public",
  publishedAt: "",
  notify: true,
  targetType: "all",
  useContentTitle: false,
  notificationTitle: "알람 내용",
};

function readMessage(
  values: PublishOptionsValues,
  field: keyof PublishOptionsValues,
): string | undefined {
  const result = publishOptionsSchema.safeParse(values);
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("publishOptionsSchema", () => {
  it('R-01 예약 발행인데 예약 시각이 비어 있으면 "필수 정보입니다." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, visibility: "scheduled" }, "publishedAt")).toBe(
      "필수 정보입니다.",
    );
    expect(readMessage(VALID_VALUES, "publishedAt")).toBeUndefined();
  });

  it('R-02 예약 시각이 현재 이전이면 "시간을 다시 선택해주세요." 오류다', () => {
    expect(
      readMessage(
        { ...VALID_VALUES, visibility: "scheduled", publishedAt: "2020-01-01T10:00" },
        "publishedAt",
      ),
    ).toBe("시간을 다시 선택해주세요.");
  });

  it('R-03 발송인데 알람 내용이 비어 있으면 "알람 내용을 입력해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, notificationTitle: "  " }, "notificationTitle")).toBe(
      "알람 내용을 입력해주세요.",
    );
    expect(
      readMessage({ ...VALID_VALUES, notify: false, notificationTitle: "" }, "notificationTitle"),
    ).toBeUndefined();
    expect(
      readMessage(
        { ...VALID_VALUES, visibility: "private", notificationTitle: "" },
        "notificationTitle",
      ),
    ).toBeUndefined();
  });

  it("모든 값이 유효하면 통과하고 알람 내용은 50자까지 허용한다", () => {
    expect(publishOptionsSchema.safeParse(VALID_VALUES).success).toBe(true);
    expect(
      publishOptionsSchema.safeParse({ ...VALID_VALUES, notificationTitle: "가".repeat(50) })
        .success,
    ).toBe(true);
    expect(
      readMessage({ ...VALID_VALUES, notificationTitle: "가".repeat(51) }, "notificationTitle"),
    ).toBeDefined();
  });
});
