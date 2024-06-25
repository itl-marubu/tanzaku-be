import * as sanitizeHtml from 'sanitize-html';
import { ngwords } from './ngwords';

export const sanitizer = (input: string, max: number) => {
  const clean = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
  if (ngwords.includes(clean)) {
    return "";
  }
  return hanZen(clean).slice(0, max);
}

const hanZen = (str: string) => {
  // ローマ字を全部全角に
  return str.replace(/[A-Za-z0-9]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}
