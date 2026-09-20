import { type ContentCategory } from "@/entities/content";

import { toggleCategory } from ".";

const THREE_SELECTED: ContentCategory[] = ["secondaryBattery", "realty", "investment"];

describe("toggleCategory", () => {
  it("R-02 카테고리는 3개까지만 선택할 수 있고, 3개가 선택된 뒤 다른 칩을 눌러도 선택되지 않는다", () => {
    expect(toggleCategory(["secondaryBattery", "realty"], "investment")).toEqual(THREE_SELECTED);
    expect(toggleCategory(THREE_SELECTED, "domesticStock")).toEqual(THREE_SELECTED);
  });

  it("이미 선택된 카테고리를 다시 누르면 선택이 풀린다", () => {
    expect(toggleCategory(THREE_SELECTED, "realty")).toEqual(["secondaryBattery", "investment"]);
  });
});
