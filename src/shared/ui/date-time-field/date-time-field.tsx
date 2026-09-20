import { useState } from "react";
import { Popover } from "@base-ui/react/popover";

import { cn } from "@/shared/lib/cn";

import {
  boxVariants,
  dateInputClass,
  popupClass,
  positionerClass,
  timeColumnClass,
  timeHeaderClass,
  timeListClass,
  timeOptionVariants,
  valueVariants,
} from "./date-time-field-variants";
import { formatDateTimeLabel } from "./format-date-time-label";
import { buildTimeOptions } from "./time-options";
import { type DateTimeDraft, type DateTimeFieldProps } from "./types";

function scrollOptionIntoView(node: HTMLButtonElement | null) {
  if (node !== null) {
    node.scrollIntoView({ block: "nearest" });
  }
}

export function DateTimeField({
  value,
  onChange,
  placeholder,
  invalid = false,
  disabled = false,
  min,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  className,
}: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateTimeDraft>({ date: "", time: "" });
  const label = formatDateTimeLabel(value);
  const isFilled = label !== "";

  function changeOpen(next: boolean) {
    if (next) {
      const [date = "", time = ""] = value.split("T");
      setDraft({ date, time });
    }
    setOpen(next);
  }

  function pickDraft(next: DateTimeDraft) {
    setDraft(next);
    if (next.date !== "" && next.time !== "") {
      onChange(`${next.date}T${next.time}`);
      setOpen(false);
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={changeOpen}>
      <Popover.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn(boxVariants({ disabled, invalid }), className)}
      >
        <span className={valueVariants({ filled: isFilled })}>
          {isFilled ? label : placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          className={positionerClass()}
        >
          <Popover.Popup className={popupClass()}>
            <input
              type="date"
              aria-label="발송 날짜"
              min={min}
              value={draft.date}
              onChange={(event) => {
                pickDraft({ ...draft, date: event.target.value });
              }}
              className={dateInputClass()}
            />
            <div className={timeColumnClass()}>
              <p className={timeHeaderClass()}>Time</p>
              <div role="listbox" aria-label="발송 시간" className={timeListClass()}>
                {buildTimeOptions(draft.time).map((time) => {
                  const selected = time === draft.time;

                  return (
                    <button
                      key={time}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      ref={selected ? scrollOptionIntoView : undefined}
                      onClick={() => {
                        pickDraft({ ...draft, time });
                      }}
                      className={timeOptionVariants({ selected })}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
