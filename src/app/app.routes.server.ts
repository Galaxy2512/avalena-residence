import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Units } from './services/units';

// Sve stranice se pri buildu generiraju kao gotov HTML (prerender), na oba jezika,
// kako bi tražilice i društvene mreže vidjele sadržaj bez pokretanja JavaScripta.
const unitParams = async () => inject(Units).getAll().map((unit) => ({ propertyId: unit.id }));

const roomParams = async () =>
  inject(Units)
    .getAll()
    .flatMap((unit) => unit.rooms.map((room) => ({ propertyId: unit.id, roomId: room.id })));

export const serverRoutes: ServerRoute[] = [
  // Hrvatski
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'smjestaj/:propertyId', renderMode: RenderMode.Prerender, getPrerenderParams: unitParams },
  { path: 'smjestaj/:propertyId/:roomId', renderMode: RenderMode.Prerender, getPrerenderParams: roomParams },
  { path: 'politika-privatnosti', renderMode: RenderMode.Prerender },
  { path: 'politika-kolacica', renderMode: RenderMode.Prerender },

  // Engleski
  { path: 'en', renderMode: RenderMode.Prerender },
  { path: 'en/accommodation/:propertyId', renderMode: RenderMode.Prerender, getPrerenderParams: unitParams },
  { path: 'en/accommodation/:propertyId/:roomId', renderMode: RenderMode.Prerender, getPrerenderParams: roomParams },
  { path: 'en/privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'en/cookie-policy', renderMode: RenderMode.Prerender },

  // Nepostojeće adrese: server vraća 404, a stranicu "nije pronađeno" prikazuje Angular
  { path: '**', renderMode: RenderMode.Client },
];
