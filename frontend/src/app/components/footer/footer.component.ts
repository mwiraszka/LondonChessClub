import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { HealthApiService } from '@app/services';

import packageJson from '../../../../package.json';

@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [MatIconModule, RouterLink, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  private readonly healthApiService = inject(HealthApiService);

  public readonly CURRENT_VERSION = packageJson.version;
  public readonly CURRENT_YEAR = new Date().getFullYear();
  public readonly backendVersion = signal<string | null>(null);

  ngOnInit(): void {
    this.healthApiService.getVersion().subscribe({
      next: response => this.backendVersion.set(response.data),
      error: () => this.backendVersion.set(null),
    });
  }
}
