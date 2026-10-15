// Jezično ovisne adrese stranica.
// Hrvatski je na korijenu (/smjestaj/...), engleski pod /en (/en/accommodation/...).

export type Lang = 'hr' | 'en';
export type Page = 'home' | 'unit' | 'room' | 'privacy' | 'cookies';

const SEGMENTS = {
  unit: { hr: 'smjestaj', en: 'accommodation' },
  privacy: { hr: 'politika-privatnosti', en: 'privacy-policy' },
  cookies: { hr: 'politika-kolacica', en: 'cookie-policy' },
} as const;

type SegmentKey = keyof typeof SEGMENTS;

export function langFromUrl(url: string): Lang {
  return /^\/en(?=$|[/?#])/.test(url) ? 'en' : 'hr';
}

/** Putanja stranice na zadanom jeziku, npr. pagePath('en', 'room', 'rooms', 'dvokrevetna-balkon'). */
export function pagePath(lang: Lang, page: Page, ...ids: string[]): string {
  const prefix = lang === 'en' ? '/en' : '';
  if (page === 'home') return prefix || '/';
  const segment = SEGMENTS[page === 'room' ? 'unit' : page][lang];
  return [prefix, segment, ...ids].join('/');
}

/** Ista stranica na drugom jeziku, npr. /smjestaj/rooms -> /en/accommodation/rooms. */
export function translateUrl(url: string, target: Lang): string {
  const [, rawPath, suffix] = url.match(/^([^?#]*)(.*)$/)!;
  const source = langFromUrl(rawPath);
  const path = source === 'en' ? rawPath.slice(3) : rawPath;
  const parts = path.split('/').filter(Boolean);

  if (parts.length) {
    const key = (Object.keys(SEGMENTS) as SegmentKey[]).find(
      (k) => SEGMENTS[k][source] === parts[0],
    );
    if (key) parts[0] = SEGMENTS[key][target];
  }

  const prefix = target === 'en' ? '/en' : '';
  const result = prefix + (parts.length ? '/' + parts.join('/') : '');
  return (result || '/') + suffix;
}
