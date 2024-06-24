import * as sanitizeHtml from 'sanitize-html';

export const sanitizer = (input: string, max: number) => {
  const clean = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return clean.slice(0, max);
}
