import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UnitDetail } from './pages/unit-detail/unit-detail';
import { RoomDetail } from './pages/room-detail/room-detail';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { CookiePolicy } from './pages/cookie-policy/cookie-policy';
import { NotFound } from './pages/not-found/not-found';

// Adrese moraju odgovarati onima u i18n-routes.ts.
export const routes: Routes = [
  // Hrvatski
  { path: '', component: Home },
  { path: 'smjestaj/:propertyId', component: UnitDetail },
  { path: 'smjestaj/:propertyId/:roomId', component: RoomDetail },
  { path: 'politika-privatnosti', component: PrivacyPolicy },
  { path: 'politika-kolacica', component: CookiePolicy },

  // Engleski
  { path: 'en', component: Home },
  { path: 'en/accommodation/:propertyId', component: UnitDetail },
  { path: 'en/accommodation/:propertyId/:roomId', component: RoomDetail },
  { path: 'en/privacy-policy', component: PrivacyPolicy },
  { path: 'en/cookie-policy', component: CookiePolicy },

  { path: '**', component: NotFound },
];
