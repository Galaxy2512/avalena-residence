import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { LangService } from './services/lang.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main><router-outlet></router-outlet></main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      main {
        display: block;
      }
    `,
  ],
})
export class App implements OnInit {
  private readonly lang = inject(LangService);
  ngOnInit(): void {
    this.lang.set(this.lang.current());
  }
}
