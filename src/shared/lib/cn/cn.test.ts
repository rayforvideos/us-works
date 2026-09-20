import { cn } from ".";

describe("cn", () => {
  it("같은 계열 클래스가 겹치면 뒤에 온 것만 남긴다", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("거짓 값과 undefined는 무시한다", () => {
    expect(cn("h-12", false, undefined, null)).toBe("h-12");
  });

  it("텍스트 스타일 토큰과 글자색 클래스는 함께 남는다", () => {
    expect(cn("text-16-sb600", "text-white")).toBe("text-16-sb600 text-white");
  });

  it("텍스트 스타일 토큰끼리는 뒤에 온 것만 남는다", () => {
    expect(cn("text-16-sb600", "text-18-b700")).toBe("text-18-b700");
  });

  it("라운드 토큰끼리는 뒤에 온 것만 남는다", () => {
    expect(cn("rounded-14", "rounded-4")).toBe("rounded-4");
  });
});
