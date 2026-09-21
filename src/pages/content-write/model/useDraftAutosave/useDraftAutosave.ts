import { useEffect, useEffectEvent, useRef } from "react";

import { writeContentDraft } from "@/entities/content";

import { DRAFT_AUTOSAVE_MS } from "./constants";
import { type DraftAutosaveOptions } from "./types";

export function useDraftAutosave({ getValues, onSaved }: DraftAutosaveOptions) {
  const savedValuesRef = useRef<string | null>(null);

  function save(onlyWhenChanged: boolean) {
    const values = getValues();
    const serialized = JSON.stringify(values);
    if (onlyWhenChanged && serialized === savedValuesRef.current) {
      return;
    }
    const savedAt = writeContentDraft(values);
    if (savedAt === null) {
      return;
    }
    savedValuesRef.current = serialized;
    onSaved(savedAt);
  }

  const saveChanged = useEffectEvent(() => {
    save(true);
  });

  useEffect(() => {
    const timer = setInterval(saveChanged, DRAFT_AUTOSAVE_MS);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function saveNow() {
    save(false);
  }

  return { saveNow };
}
