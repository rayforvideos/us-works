import { Navigate, useParams } from "react-router";

import { ROUTES } from "@/shared/config";
import { parseNumericId } from "@/shared/lib/numeric-id";

import { ContentCreateView } from "../content-create-view";
import { ContentEditView } from "../content-edit-view";

export function ContentWritePage() {
  const { id } = useParams();

  if (id === undefined) {
    return <ContentCreateView />;
  }

  const contentId = parseNumericId(id);
  if (contentId === null) {
    return <Navigate to={ROUTES.contents} replace />;
  }
  return <ContentEditView id={contentId} />;
}
