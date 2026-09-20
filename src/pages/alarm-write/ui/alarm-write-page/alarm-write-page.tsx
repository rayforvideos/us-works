import { Navigate, useParams, useSearchParams } from "react-router";

import { ROUTES } from "@/shared/config";

import { parseContentId } from "../../model/content-id-param";
import { AlarmCreateView } from "../alarm-create-view";
import { AlarmEditView } from "../alarm-edit-view";

export function AlarmWritePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  if (id !== undefined) {
    return <AlarmEditView id={id} />;
  }

  const contentId = parseContentId(searchParams);
  if (contentId === null) {
    return <Navigate to={ROUTES.contents} replace />;
  }
  return <AlarmCreateView contentId={contentId} />;
}
