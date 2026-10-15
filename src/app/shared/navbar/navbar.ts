import { Component, DOCUMENT, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Units } from '../../services/units';
import { Lang, LangService } from '../../services/lang.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnDestroy {
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  private readonly document = inject(DOCUMENT);
  protected readonly isMenuOpen = signal(false);
  protected readonly units = this.unitsService.getAll();

  toggleMenu(): void {
    this.isMenuOpen.update((o) => !o);
    this.updateBodyScroll();
  }

  switchLang(event: MouseEvent, lang: Lang): void {
    event.preventDefault();
    this.closeMenu();
    this.lang.switchTo(lang);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.updateBodyScroll();
  }

  ngOnDestroy(): void {
    // Osiguraj da body scroll ostane otključan ako se komponenta uništi
    // dok je mobilni izbornik otvoren (npr. navigacija/route change).
    this.document.body.style.overflow = '';
  }

  private updateBodyScroll(): void {
    this.document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }
}
