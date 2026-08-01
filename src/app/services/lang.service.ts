import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'hr' | 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly STORAGE_KEY = 'avalena_lang';
  readonly current = signal<Lang>(this.getInitialLang());

  constructor(private translate: TranslateService) {
    this.translate.use(this.current());
  }

  toggle(): void { this.set(this.current() === 'hr' ? 'en' : 'hr'); }

  set(lang: Lang): void {
    this.current.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  private getInitialLang(): Lang {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Lang | null;
    if (stored === 'hr' || stored === 'en') return stored;
    return navigator.language.startsWith('hr') ? 'hr' : 'en';
  }
}
