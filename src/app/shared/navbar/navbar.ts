import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
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
  }
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
