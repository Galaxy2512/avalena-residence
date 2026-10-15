import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Units } from './services/units';

// Sve stranice se pri buildu generiraju kao gotov HTML (prerender), kako bi
// tražilice i društvene mreže vidjele sadržaj bez pokretanja JavaScripta.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'smjestaj/:propertyId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      inject(Units).getAll().map((unit) => ({ propertyId: unit.id })),
  },
  {
    path: 'smjestaj/:propertyId/:roomId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      inject(Units)
        .getAll()
        .flatMap((unit) => unit.rooms.map((room) => ({ propertyId: unit.id, roomId: room.id }))),
  },
  { path: 'politika-privatnosti', renderMode: RenderMode.Prerender },
  { path: 'politika-kolacica', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
