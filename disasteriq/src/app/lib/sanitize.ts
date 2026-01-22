import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (value: unknown) => {
  if (typeof value !== "string") return value;

  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};