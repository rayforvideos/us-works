import { useParams } from "react-router";

import { ContentCreateView } from "../content-create-view";
import { ContentEditView } from "../content-edit-view";

export function ContentWritePage() {
  const { id } = useParams();

  if (id === undefined) {
    return <ContentCreateView />;
  }
  return <ContentEditView id={id} />;
}
