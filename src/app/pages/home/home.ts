import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';
import { organizationJsonLd, SeoService } from '../../services/seo.service';

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const lang = this.lang.current();
      const description = this.translate.instant('FOOTER.DESC');
      this.seo.update({
        title:
          lang === 'hr'
            ? 'Avalena – apartmani i sobe u Boriku, Zadar'
            : 'Avalena – Apartments & Rooms in Borik, Zadar',
        description,
        path: '/',
        lang,
        jsonLd: organizationJsonLd(description),
      });
    });
  }

  getTagline(unit: any): string {
    return this.lang.current() === 'hr' ? unit.taglineHr : unit.taglineEn;
  }
  getDescription(unit: any): string {
    return this.lang.current() === 'hr' ? unit.descriptionHr : unit.descriptionEn;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
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
