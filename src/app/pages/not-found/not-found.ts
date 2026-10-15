import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="not-found container">
      <h1>{{ 'NOT_FOUND.TITLE' | translate }}</h1>
      <a [routerLink]="lang.path('home')" class="btn btn-outline-dark">{{ 'NOT_FOUND.BACK' | translate }}</a>
    </div>
  `,
  styles: `
    .not-found { padding: 10rem 2rem; text-align: center; }
    h1 { margin-bottom: 2rem; font-weight: 300; color: var(--c-navy); }
    @media (max-width: 640px) { .not-found { padding: 7rem 1rem; } }
  `,
})
export class NotFound {
  protected readonly lang = inject(LangService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => this.seo.notFound(this.lang.current()));
  }
}
