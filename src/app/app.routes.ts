import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UnitDetail } from './pages/unit-detail/unit-detail';
import { RoomDetail } from './pages/room-detail/room-detail';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { CookiePolicy } from './pages/cookie-policy/cookie-policy';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'smjestaj/:propertyId', component: UnitDetail },
  { path: 'smjestaj/:propertyId/:roomId', component: RoomDetail },
  { path: 'politika-privatnosti', component: PrivacyPolicy },
  { path: 'politika-kolacica', component: CookiePolicy },
  { path: '**', redirectTo: '' },
];
