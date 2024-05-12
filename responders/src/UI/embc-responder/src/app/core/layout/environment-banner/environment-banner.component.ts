import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../models/environment-information.model';
import { EnvironmentBannerService } from './environment-banner.service';
import { MarkdownComponent } from 'ngx-markdown';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
  standalone: true,
  imports: [NgStyle, MarkdownComponent]
})
export class EnvironmentBannerComponent implements OnInit {
  environment: EnvironmentInformation;

  constructor(private envBannerService: EnvironmentBannerService) {}

  ngOnInit(): void {
    this.environment = this.envBannerService.getEnvironmentBanner();
  }
}
