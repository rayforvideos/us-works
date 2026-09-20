type NewPostOptionId = "continue" | "new";

type NewPostOptionIcon = "pen" | "chat";

export type NewPostOption = {
  id: NewPostOptionId;
  icon: NewPostOptionIcon;
  title: string;
  description: string;
};
