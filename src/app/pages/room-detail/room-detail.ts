import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.scss',
})
export class RoomDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  protected readonly activeImage = signal<string | null>(null);

  protected readonly data = toSignal(
    this.route.paramMap.pipe(
      map((p) => ({ propertyId: p.get('propertyId') ?? '', roomId: p.get('roomId') ?? '' })),
      switchMap(({ propertyId, roomId }) => {
        const result = this.unitsService.getRoomById(propertyId, roomId);
        this.activeImage.set(result?.room.heroImage ?? null);
        return [result];
      }),
    ),
    { initialValue: undefined },
  );

  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const data = this.data();
      const lang = this.lang.current();
      if (!data) return this.seo.notFound(lang);
      const { unit, room } = data;
      this.seo.update({
        title: `${lang === 'hr' ? room.name : room.nameEn} – ${unit.name}, Borik, Zadar`,
        description: lang === 'hr' ? room.descriptionHr : room.descriptionEn,
        path: this.lang.path('room', unit.id, room.id),
        image: room.heroImage,
        lang,
      });
    });
  }

  selectImage(src: string): void {
    this.activeImage.set(src);
  }

  get unit() {
    return this.data()?.unit;
  }
  get room() {
    return this.data()?.room;
  }
  get roomName() {
    return this.lang.current() === 'hr' ? this.room?.name : this.room?.nameEn;
  }
  get roomDesc() {
    return this.lang.current() === 'hr' ? this.room?.descriptionHr : this.room?.descriptionEn;
  }
  get amenities() {
    return this.lang.current() === 'hr' ? this.room?.amenities : this.room?.amenitiesEn;
  }
  bedLabel(type: string): string {
    if (this.lang.current() === 'en') {
      const m: Record<string, string> = {
        'Veliki bračni krevet': 'Large double bed',
        'Krevet za 1 osobu': 'Single bed',
        'Sofa-krevet': 'Sofa bed',
        'Sofa-krevet u dnevnom boravku': 'Sofa bed in living room',
        'Kauč na rasklapanje': 'Sofa bed',
        'Krevet na kat': 'Bunk bed',
      };
      return m[type] ?? type;
    }
    return type;
  }

  otherRooms() {
    if (!this.unit || !this.room) return [];
    return this.unit.rooms.filter((r) => r.id !== this.room!.id).slice(0, 3);
  }
  otherRoomName(room: any): string {
    return this.lang.current() === 'hr' ? room.name : room.nameEn;
  }
}
