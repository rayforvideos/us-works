import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { TextField } from "@/shared/ui/text-field";

import { isHttpUrl, LINK_FORMAT_MESSAGE } from "../../model/content-input-schema";
import { type LinkFieldProps } from "./types";

/**
 * @constants
 */
const LINK_PLACEHOLDER = "링크를 입력해주세요.";

const INSERTED_LINK_PLACEHOLDER = "삽입된 링크가 있습니다.";

export function LinkField({ value, onChange, disabled = false }: LinkFieldProps) {
  const [draft, setDraft] = useState("");
  const isInserted = value !== "";
  const isDraftInvalid = draft !== "" && !isHttpUrl(draft);

  function clearLink() {
    setDraft("");
    onChange("");
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start gap-2.5">
        <TextField
          aria-label="링크"
          clearable
          placeholder={isInserted ? INSERTED_LINK_PLACEHOLDER : LINK_PLACEHOLDER}
          value={isInserted ? "" : draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onClear={() => {
            setDraft("");
          }}
          disabled={disabled || isInserted}
          error={isDraftInvalid ? LINK_FORMAT_MESSAGE : undefined}
        />
        <Button
          size="medium"
          type="button"
          disabled={disabled || isInserted || !isHttpUrl(draft)}
          onClick={() => {
            onChange(draft);
          }}
        >
          삽입
        </Button>
      </div>
      {isInserted ? (
        <div role="group" aria-label="삽입된 링크">
          <TextField
            aria-label="삽입된 링크 주소"
            value={value}
            readOnly
            clearable
            onClear={clearLink}
            disabled={disabled}
          />
        </div>
      ) : null}
    </div>
  );
}
