import { notificationInputSchema } from ".";
import { type NotificationFormValues } from "./types";

const VALID_VALUES: NotificationFormValues = {
  targetType: "all",
  title: "알림 제목",
  scheduledAt: "2099-12-31T14:30",
};

function readMessage(
  values: NotificationFormValues,
  field: keyof NotificationFormValues,
): string | undefined {
  const result = notificationInputSchema.safeParse(values);
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("notificationInputSchema", () => {
  it('R-01 제목이 비어 있으면 "필수 정보입니다." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, title: "  " }, "title")).toBe("필수 정보입니다.");
  });

  it('R-03 시간이 비어 있으면 "필수 정보입니다." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, scheduledAt: "" }, "scheduledAt")).toBe(
      "필수 정보입니다.",
    );
  });

  it('R-04 시간이 현재 이전이면 "현재 이후 시간을 선택해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, scheduledAt: "2020-01-01T10:00" }, "scheduledAt")).toBe(
      "현재 이후 시간을 선택해주세요.",
    );
  });

  it('R-06 시간의 분이 00 또는 30이 아니면 "30분 단위로 선택해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, scheduledAt: "2099-12-31T14:15" }, "scheduledAt")).toBe(
      "30분 단위로 선택해주세요.",
    );
    expect(
      notificationInputSchema.safeParse({ ...VALID_VALUES, scheduledAt: "2099-12-31T14:00" })
        .success,
    ).toBe(true);
  });

  it("모든 값이 유효하면 통과하고 제목은 50자까지 허용한다", () => {
    expect(notificationInputSchema.safeParse(VALID_VALUES).success).toBe(true);
    expect(
      notificationInputSchema.safeParse({ ...VALID_VALUES, title: "가".repeat(50) }).success,
    ).toBe(true);
    expect(readMessage({ ...VALID_VALUES, title: "가".repeat(51) }, "title")).toBeDefined();
  });
});
