import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsentService } from '../../services/consent.service';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
})
export class CookieConsent {
  protected readonly consent = inject(ConsentService);
  protected readonly lang = inject(LangService);

  openSettings(): void {
    this.consent.isDetailed.set(true);
  }

  onAnalyticsChange(event: Event): void {
    this.consent.toggle('analytics', (event.target as HTMLInputElement).checked);
  }

  onMarketingChange(event: Event): void {
    this.consent.toggle('marketing', (event.target as HTMLInputElement).checked);
  }
}
