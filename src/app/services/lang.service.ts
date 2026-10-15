import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'hr' | 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly STORAGE_KEY = 'avalena_lang';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  readonly current = signal<Lang>(this.getInitialLang());

  constructor(private translate: TranslateService) {
    this.translate.use(this.current());
  }

  toggle(): void { this.set(this.current() === 'hr' ? 'en' : 'hr'); }

  set(lang: Lang): void {
    this.current.set(lang);
    this.translate.use(lang);
    if (this.isBrowser) localStorage.setItem(this.STORAGE_KEY, lang);
    this.document.documentElement.lang = lang;
  }

  private getInitialLang(): Lang {
    // Prerenderirane stranice se generiraju na hrvatskom.
    if (!this.isBrowser) return 'hr';
    const stored = localStorage.getItem(this.STORAGE_KEY) as Lang | null;
    if (stored === 'hr' || stored === 'en') return stored;
    return navigator.language.startsWith('hr') ? 'hr' : 'en';
  }
}
