import { useState } from "react";
import { useNavigate } from "react-router";

import { clearContentDraft, readContentDraft } from "@/entities/content";
import { ROUTES } from "@/shared/config";
import { Dialog } from "@/shared/ui/dialog";
import { ChatIcon, PenLineIcon } from "@/shared/ui/icon";

import { buildNewPostOptions, type NewPostOption } from "../../model/build-new-post-options";
import {
  itemClass,
  listClass,
  optionButtonClass,
  optionDescriptionClass,
  optionIconClass,
  optionTextsClass,
  optionTitleClass,
} from "./new-post-dialog-variants";
import { type NewPostDialogProps } from "./types";

/**
 * @types
 */
type NewPostOptionListProps = {
  onSelect: (option: NewPostOption) => void;
};

/**
 * @constants
 */
const OPTION_ICONS = { pen: PenLineIcon, chat: ChatIcon };

function NewPostOptionList({ onSelect }: NewPostOptionListProps) {
  const [options] = useState(() => buildNewPostOptions(readContentDraft()));

  return (
    <ul className={listClass()}>
      {options.map((option) => {
        const OptionIcon = OPTION_ICONS[option.icon];

        return (
          <li key={option.id} className={itemClass()}>
            <button
              type="button"
              className={optionButtonClass()}
              onClick={() => {
                onSelect(option);
              }}
            >
              <span className={optionIconClass()}>
                <OptionIcon />
              </span>
              <span className={optionTextsClass()}>
                <span className={optionTitleClass()}>{option.title}</span>
                <span className={optionDescriptionClass()}>{option.description}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function NewPostDialog({ open, onOpenChange, finalFocus }: NewPostDialogProps) {
  const navigate = useNavigate();

  function startWriting(option: NewPostOption) {
    if (option.id === "new") {
      clearContentDraft();
    }
    onOpenChange(false);
    void navigate(ROUTES.contentNew);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="새글쓰기" finalFocus={finalFocus}>
      <NewPostOptionList onSelect={startWriting} />
    </Dialog>
  );
}
