import { Component, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnDestroy {
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);
  protected readonly units = this.unitsService.getAll();

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 40);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((o) => !o);
    this.updateBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.updateBodyScroll();
  }

  ngOnDestroy(): void {
    // Osiguraj da body scroll ostane otključan ako se komponenta uništi
    // dok je mobilni izbornik otvoren (npr. navigacija/route change).
    document.body.style.overflow = '';
  }

  private updateBodyScroll(): void {
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }
}
