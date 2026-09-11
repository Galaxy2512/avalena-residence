import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsentService } from '../../services/consent.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
})
export class CookieConsent {
  protected readonly consent = inject(ConsentService);

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
