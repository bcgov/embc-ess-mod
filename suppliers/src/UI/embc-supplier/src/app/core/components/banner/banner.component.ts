import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class BannerComponent {
  @Input() bannerMsg: string | SafeHtml;
  @Input() bannerType: string;

  constructor() {}
}
