import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Units } from '../../services/units';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly unitsService = inject(Units);
  protected readonly lang = inject(LangService);
  protected readonly units = this.unitsService.getAll();
  protected readonly year = new Date().getFullYear();
}
