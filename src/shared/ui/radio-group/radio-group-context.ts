import { createContext, useContext } from "react";

import { type RadioGroupContextValue } from "./types";

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const RadioGroupProvider = RadioGroupContext.Provider;

export function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (context === null) {
    throw new Error("RadioGroupItem은 RadioGroup 안에서만 쓸 수 있습니다.");
  }
  return context;
}
