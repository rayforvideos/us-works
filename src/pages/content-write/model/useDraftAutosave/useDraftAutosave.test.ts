import { act, renderHook } from "@testing-library/react";

import { CONTENT_DRAFT_KEY } from "@/entities/content";

import { type ContentFormValues } from "../content-input-schema";
import { useDraftAutosave } from ".";

const FILLED_VALUES: ContentFormValues = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "",
};

function hasStoredDraft(): boolean {
  return localStorage.getItem(CONTENT_DRAFT_KEY) !== null;
}

describe("useDraftAutosave", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("30초마다 값이 바뀌었으면 임시저장하고 저장 시각을 알린다", () => {
    const onSaved = vi.fn();
    renderHook(() => useDraftAutosave({ getValues: () => FILLED_VALUES, onSaved }));

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(hasStoredDraft()).toBe(true);
    expect(onSaved).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("즉시 저장은 값이 그대로여도 다시 저장한다", () => {
    const onSaved = vi.fn();
    const { result } = renderHook(() =>
      useDraftAutosave({ getValues: () => FILLED_VALUES, onSaved }),
    );

    act(() => {
      result.current.saveNow();
      result.current.saveNow();
    });

    expect(onSaved).toHaveBeenCalledTimes(2);
  });
});
