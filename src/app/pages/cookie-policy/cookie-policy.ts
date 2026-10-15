import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';
import { SeoService } from '../../services/seo.service';
import { ConsentService } from '../../services/consent.service';

@Component({
  selector: 'app-cookie-policy',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cookie-policy.html',
  styleUrl: './cookie-policy.scss',
})
export class CookiePolicy {
  protected readonly lang = inject(LangService);
  protected readonly consent = inject(ConsentService);
  protected readonly lastUpdated = '11.09.2026.';
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const lang = this.lang.current();
      this.seo.update({
        title: `${this.translate.instant('LEGAL.COOKIE_POLICY')} | Avalena`,
        description: lang === 'hr' ? 'Politika kolačića web stranice Avalena – smještaj u Boriku, Zadar.' : 'Cookie policy of the Avalena website – accommodation in Borik, Zadar.',
        path: this.lang.path('cookies'),
        lang,
      });
    });
  }
}
