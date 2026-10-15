import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import hr from '../../../public/i18n/hr.json';
import en from '../../../public/i18n/en.json';

// Prijevodi su ugrađeni u bundle (umjesto HTTP dohvaćanja) kako bi bili
// dostupni i pri prerenderiranju stranica tijekom builda.
const TRANSLATIONS: Record<string, TranslationObject> = { hr, en };

@Injectable()
export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['hr']);
  }
}
