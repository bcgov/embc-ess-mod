import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ConfigGuard } from '../core/guards/config.guard';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  @Input() bannerMsg: SafeHtml =
    'The ERA Supplier Portal is currently undergoing maintenance and will be back as soon as possible.';

  constructor(
    private configGuard: ConfigGuard,
    private sanitizer: DomSanitizer
  ) {
    const configResult = this.configGuard.configResult;

    if (configResult.maintMsg && configResult.maintMsg !== 'Default') {
      this.bannerMsg = this.sanitizer.bypassSecurityTrustHtml(
        configResult.maintMsg
      );
    }
  }

  ngOnInit(): void {}
}
