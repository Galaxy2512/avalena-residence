import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';
import { RentalUnit, Room } from '../../services/unit.model';

@Component({
  selector: 'app-unit-detail',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './unit-detail.html',
  styleUrl: './unit-detail.scss',
})
export class UnitDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  protected readonly activeImage = signal<string | null>(null);

  protected readonly unit = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('propertyId') ?? ''),
      switchMap((id) => {
        const found = this.unitsService.getById(id);
        this.activeImage.set(found?.heroImage ?? null);
        return [found];
      }),
    ),
    { initialValue: undefined },
  );

  protected readonly otherUnits = (current: RentalUnit | undefined) =>
    this.unitsService.getAll().filter((u) => u.id !== current?.id);

  selectImage(src: string): void {
    this.activeImage.set(src);
  }

  name(unit: RentalUnit): string {
    return unit.name;
  }
  tagline(unit: RentalUnit): string {
    return this.lang.current() === 'hr' ? unit.taglineHr : unit.taglineEn;
  }
  desc(unit: RentalUnit): string {
    return this.lang.current() === 'hr' ? unit.longDescriptionHr : unit.longDescriptionEn;
  }
  roomName(room: Room): string {
    return this.lang.current() === 'hr' ? room.name : room.nameEn;
  }
  roomDesc(room: Room): string {
    return this.lang.current() === 'hr' ? room.descriptionHr : room.descriptionEn;
  }
  bedLabel(type: string): string {
    if (this.lang.current() === 'en') {
      const map: Record<string, string> = {
        'Veliki bračni krevet': 'Large double bed',
        'Krevet za 1 osobu': 'Single bed',
        'Sofa-krevet': 'Sofa bed',
        'Sofa-krevet u dnevnom boravku': 'Sofa bed in living room',
      };
      return map[type] ?? type;
    }
    return type;
  }
}
