import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentCategory = 'analytics' | 'marketing';

interface StoredConsent {
  version: number;
  decidedAt: string;
  preferences: ConsentPreferences;
}

const STORAGE_KEY = 'avalena_cookie_consent';
// Bump when the categories on offer change — forces users to re-decide.
const CONSENT_VERSION = 1;

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly stored = signal<StoredConsent | null>(this.readStored());

  readonly hasDecided = computed(() => this.stored() !== null);
  readonly preferences = signal<ConsentPreferences>(
    this.stored()?.preferences ?? DEFAULT_PREFERENCES,
  );

  /** True while the settings toggles should be shown (vs. the compact banner). */
  readonly isDetailed = signal(false);
  /** True when the banner/panel was explicitly reopened (e.g. from the footer). */
  private readonly reopened = signal(false);

  // Banner se ne prerenderira u HTML, inače bi bljesnuo i gostima koji su već odlučili.
  readonly isVisible = computed(
    () => this.isBrowser && (!this.hasDecided() || this.reopened()),
  );

  /** Use before firing any non-essential script (analytics/marketing pixels). */
  hasConsent(category: ConsentCategory): boolean {
    return this.preferences()[category];
  }

  toggle(category: ConsentCategory, value: boolean): void {
    this.preferences.update((p) => ({ ...p, [category]: value }));
  }

  acceptAll(): void {
    this.commit({ necessary: true, analytics: true, marketing: true });
  }

  rejectNonEssential(): void {
    this.commit({ necessary: true, analytics: false, marketing: false });
  }

  savePreferences(): void {
    this.commit(this.preferences());
  }

  /** Reopens the banner in settings mode, e.g. from a footer link. */
  openPreferences(): void {
    this.isDetailed.set(true);
    this.reopened.set(true);
  }

  /** Discards unsaved edits and hides the reopened panel. */
  dismissPreferences(): void {
    const s = this.stored();
    this.preferences.set(s?.preferences ?? DEFAULT_PREFERENCES);
    this.isDetailed.set(false);
    this.reopened.set(false);
  }

  private commit(preferences: ConsentPreferences): void {
    const record: StoredConsent = {
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
      preferences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    this.stored.set(record);
    this.preferences.set(preferences);
    this.isDetailed.set(false);
    this.reopened.set(false);
  }

  private readStored(): StoredConsent | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredConsent;
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}
