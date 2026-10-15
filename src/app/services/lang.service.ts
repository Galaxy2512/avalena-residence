import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs';
import { Lang, Page, langFromUrl, pagePath, translateUrl } from '../i18n-routes';
import { IMAGE_ALTS } from './image-alts';

export type { Lang } from '../i18n-routes';

/** Jezik se određuje iz adrese stranice (/en/... = engleski, ostalo = hrvatski). */
@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly STORAGE_KEY = 'avalena_lang';
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly current = signal<Lang>('hr');

  constructor() {
    this.apply('hr');

    this.router.events
      .pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized))
      .subscribe((e) => this.apply(langFromUrl(e.urlAfterRedirects)));

    // Gost koji je ranije odabrao drugi jezik automatski dobiva tu verziju stranice.
    if (this.isBrowser) {
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          take(1),
        )
        .subscribe((e) => {
          const stored = this.storedPreference();
          if (stored && stored !== langFromUrl(e.urlAfterRedirects)) {
            this.router.navigateByUrl(translateUrl(e.urlAfterRedirects, stored), {
              replaceUrl: true,
            });
          }
        });
    }
  }

  /** Putanja stranice na trenutnom jeziku, za [routerLink]. */
  path(page: Page, ...ids: string[]): string {
    return pagePath(this.current(), page, ...ids);
  }

  /** Alt tekst slike na trenutnom jeziku (iz image-alts.ts), ili `fallback` ako opis ne postoji. */
  imageAlt(src: string, fallback: string): string {
    return IMAGE_ALTS[src]?.[this.current()] ?? fallback;
  }

  /** Adresa trenutne stranice na zadanom jeziku. */
  alternateUrl(lang: Lang): string {
    return translateUrl(this.router.url, lang);
  }

  /** Prebacuje na isti sadržaj na drugom jeziku i pamti izbor. */
  switchTo(lang: Lang): void {
    if (this.isBrowser) localStorage.setItem(this.STORAGE_KEY, lang);
    this.router.navigateByUrl(this.alternateUrl(lang));
  }

  private apply(lang: Lang): void {
    this.current.set(lang);
    this.translate.use(lang);
    this.document.documentElement.lang = lang;
  }

  private storedPreference(): Lang | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'hr' || stored === 'en' ? stored : null;
  }
}
