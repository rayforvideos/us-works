import { useEffect } from "react";

import { type FormValuesWatcherProps } from "./types";

export function FormValuesWatcher<TValues>({ values, onChange }: FormValuesWatcherProps<TValues>) {
  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  return null;
}
