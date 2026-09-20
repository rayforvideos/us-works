import { useEffect, useRef } from "react";

import { DRAFT_AUTOSAVE_MS, writeContentDraft } from "../content-draft";
import { type DraftAutosaveOptions, type SaveDraft } from "./types";

export function useDraftAutosave({ enabled, getValues, onSaved }: DraftAutosaveOptions) {
  const saveRef = useRef<SaveDraft>(() => undefined);
  const savedValuesRef = useRef<string | null>(null);

  useEffect(() => {
    saveRef.current = ({ onlyWhenChanged }) => {
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
    };
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const timer = setInterval(() => {
      saveRef.current({ onlyWhenChanged: true });
    }, DRAFT_AUTOSAVE_MS);

    return () => {
      clearInterval(timer);
    };
  }, [enabled]);

  function saveNow() {
    saveRef.current({ onlyWhenChanged: false });
  }

  return { saveNow };
}
