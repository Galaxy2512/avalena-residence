import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { CookieConsent } from './shared/cookie-consent/cookie-consent';
import { LangService } from './services/lang.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CookieConsent],
  template: `
    <app-navbar></app-navbar>
    <main><router-outlet></router-outlet></main>
    <app-footer></app-footer>
    <app-cookie-consent></app-cookie-consent>
  `,
  styles: [
    `
      main {
        display: block;
      }
    `,
  ],
})
export class App {
  // Kreira LangService odmah pri pokretanju, da jezik prati adresu od prve stranice.
  private readonly lang = inject(LangService);
}
