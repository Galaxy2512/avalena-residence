import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang } from './lang.service';
import { RentalUnit } from './unit.model';

export const SITE_URL = 'https://avalena.hr';
const SITE_NAME = 'Avalena';
const DEFAULT_IMAGE = '/images/ZA NASLOVNU.jpg';
const JSON_LD_ID = 'seo-json-ld';
const TELEPHONE = '+385914747435';

const SOCIAL_PROFILES = [
  'https://www.facebook.com/61591653070226/',
  'https://www.instagram.com/avalenaresidence',
  'https://www.instagram.com/avalenarooms',
];

export interface SeoData {
  title: string;
  description: string;
  /** Putanja stranice, npr. '/smjestaj/vila-ines' */
  path: string;
  lang: Lang;
  image?: string;
  jsonLd?: object;
}

/** Postavlja naslov, meta opis, canonical, Open Graph i strukturirane podatke stranice. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(data: SeoData): void {
    const url = absoluteUrl(data.path);
    const description = truncate(data.description, 160);
    const image = absoluteUrl(data.image ?? DEFAULT_IMAGE);

    this.title.setTitle(data.title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: data.lang === 'hr' ? 'hr_HR' : 'en_US' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setCanonical(url);
    this.setJsonLd(data.jsonLd);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: object | undefined): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}

/** schema.org podaci za naslovnicu — Avalena kao organizacija. */
export function organizationJsonLd(description: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL + '/',
    logo: absoluteUrl('/avalena-logo-with-background.svg'),
    description,
    email: 'info@avalena.hr',
    telephone: TELEPHONE,
    sameAs: SOCIAL_PROFILES,
  };
}

/** schema.org podaci za stranicu smještajne jedinice. */
export function lodgingJsonLd(unit: RentalUnit, lang: Lang): object {
  const street = unit.addressHr.startsWith('Ul.') ? unit.addressHr.split(',')[0] : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: unit.name,
    description: lang === 'hr' ? unit.longDescriptionHr : unit.longDescriptionEn,
    url: absoluteUrl(`/smjestaj/${unit.id}`),
    image: [unit.heroImage, ...unit.gallery.slice(0, 5)].map(absoluteUrl),
    email: 'info@avalena.hr',
    telephone: TELEPHONE,
    address: {
      '@type': 'PostalAddress',
      ...(street ? { streetAddress: street } : {}),
      addressLocality: 'Zadar',
      postalCode: '23000',
      addressCountry: 'HR',
    },
    parentOrganization: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL + '/' },
  };
}

function absoluteUrl(path: string): string {
  return SITE_URL + encodeURI(path);
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)) + '…';
}
