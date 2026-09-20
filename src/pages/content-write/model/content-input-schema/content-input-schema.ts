import { z } from "zod";

import { CONTENT_CATEGORIES } from "@/entities/content";

import {
  BODY_MAX_MESSAGE,
  BODY_REQUIRED_MESSAGE,
  CATEGORIES_MAX_MESSAGE,
  CATEGORIES_REQUIRED_MESSAGE,
  MAX_BODY_LENGTH,
  MAX_CATEGORIES,
  MAX_TITLE_LENGTH,
  TITLE_MAX_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
} from "./constants";

/**
 * @constants
 */
const HTTP_PROTOCOLS = ["http:", "https:"];

export const contentInputSchema = z.object({
  title: z.string().trim().min(1, TITLE_REQUIRED_MESSAGE).max(MAX_TITLE_LENGTH, TITLE_MAX_MESSAGE),
  body: z.string().trim().min(1, BODY_REQUIRED_MESSAGE).max(MAX_BODY_LENGTH, BODY_MAX_MESSAGE),
  categories: z
    .array(z.enum(CONTENT_CATEGORIES))
    .min(1, CATEGORIES_REQUIRED_MESSAGE)
    .max(MAX_CATEGORIES, CATEGORIES_MAX_MESSAGE),
  linkUrl: z.string(),
});

export function isHttpUrl(value: string): boolean {
  try {
    return HTTP_PROTOCOLS.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
