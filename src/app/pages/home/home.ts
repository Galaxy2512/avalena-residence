import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  protected readonly units = this.unitsService.getAll();
  private observer!: IntersectionObserver;
  private el = inject(ElementRef);

  getTagline(unit: any): string {
    return this.lang.current() === 'hr' ? unit.taglineHr : unit.taglineEn;
  }
  getDescription(unit: any): string {
    return this.lang.current() === 'hr' ? unit.descriptionHr : unit.descriptionEn;
  }

  ngAfterViewInit(): void {
    // Scroll reveal
    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            this.observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    this.el.nativeElement
      .querySelectorAll('.reveal')
      .forEach((el: Element) => this.observer.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
