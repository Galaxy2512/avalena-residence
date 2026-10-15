import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  protected readonly lang = inject(LangService);
  protected readonly lastUpdated = '11.09.2026.';
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const lang = this.lang.current();
      this.seo.update({
        title: `${this.translate.instant('LEGAL.PRIVACY_POLICY')} | Avalena`,
        description: lang === 'hr' ? 'Politika privatnosti web stranice Avalena – smještaj u Boriku, Zadar.' : 'Privacy policy of the Avalena website – accommodation in Borik, Zadar.',
        path: this.lang.path('privacy'),
        lang,
      });
    });
  }
}
