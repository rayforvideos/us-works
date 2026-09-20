import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ContentInput, createContent, updateContent } from "@/entities/content";
import { useHttpClient } from "@/shared/api";

export function useCreateContentMutation() {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ContentInput) => createContent(client, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contents", "list"] });
    },
  });
}

export function useUpdateContentMutation(id: string) {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ContentInput) => updateContent(client, id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contents", "list"] });
    },
  });
}
