import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';
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
}
