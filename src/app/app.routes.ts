import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UnitDetail } from './pages/unit-detail/unit-detail';
import { RoomDetail } from './pages/room-detail/room-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'smjestaj/:propertyId', component: UnitDetail },
  { path: 'smjestaj/:propertyId/:roomId', component: RoomDetail },
  { path: '**', redirectTo: '' },
];
