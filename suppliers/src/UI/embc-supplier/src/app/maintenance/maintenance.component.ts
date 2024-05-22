import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfigGuard } from '../core/guards/config.guard';
import { BannerComponent } from '../core/components/banner/banner.component';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  standalone: true,
  imports: [BannerComponent]
})
export class MaintenanceComponent {
  @Input() bannerMsg: SafeHtml =
    'The ERA Supplier Portal is currently undergoing maintenance and will be back as soon as possible.';

  constructor(
    private configGuard: ConfigGuard,
    private sanitizer: DomSanitizer
  ) {
    const configResult = this.configGuard.configResult;

    if (configResult.maintMsg && configResult.maintMsg !== 'Default') {
      this.bannerMsg = this.sanitizer.bypassSecurityTrustHtml(configResult.maintMsg);
    }
  }
}
