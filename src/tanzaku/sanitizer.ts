import sanitizeHtml from 'sanitize-html';
import { ngwords } from './ngwords';

export const sanitizer = (input: string, max: number): [
  string,
  boolean
] => {
  const clean = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const [sanitized, hasNg] = sanitizeString(clean, ngwords);
  return [hanZen(sanitized).slice(0, max), hasNg];
}
export const sanitizeString = (clean: string, ngWords: string[]): [string, boolean] => {
  for (const ngWord of ngWords) {
    if (clean.includes(ngWord)) {
      return ["", true];
    }
  }
  if (/^[\d\s]*$/.test(clean)) {
    return ["", true];
  }
  return [clean, false];
}

const hanZen = (str: string) => {
  // ローマ字を全部全角に
  return str.replace(/[A-Za-z0-9]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}
