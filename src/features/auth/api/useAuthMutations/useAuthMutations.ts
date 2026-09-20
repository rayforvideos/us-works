import { useMutation } from "@tanstack/react-query";

import { useSetSession } from "@/entities/session";
import { useHttpClient } from "@/shared/api";

import { type Credentials } from "../../model/credentials-schema";
import { login, register } from "../auth-api";

export function useLoginMutation() {
  const client = useHttpClient();
  const setSession = useSetSession();

  return useMutation({
    mutationFn: (body: Credentials) => login(client, body),
    onSuccess: setSession,
  });
}

export function useRegisterMutation() {
  const client = useHttpClient();
  const setSession = useSetSession();

  return useMutation({
    mutationFn: (body: Credentials) => register(client, body),
    onSuccess: setSession,
  });
}
