import { useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { PlusIcon } from "@/shared/ui/icon";

import { NewPostDialog } from "../new-post-dialog";

export function NewPostButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        size="large"
        leftIcon={<PlusIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        새 글쓰기
      </Button>
      <NewPostDialog open={open} onOpenChange={setOpen} finalFocus={buttonRef} />
    </>
  );
}
