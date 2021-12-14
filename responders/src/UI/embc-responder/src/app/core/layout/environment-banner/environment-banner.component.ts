import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../models/environment-information.model';
import { EnvironmentBannerService } from './environment-banner.service';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss']
})
export class EnvironmentBannerComponent implements OnInit {
  environment: EnvironmentInformation;

  constructor(private envBannerService: EnvironmentBannerService) {}

  ngOnInit(): void {
    this.environment = this.envBannerService.getEnvironmentBanner();
  }
}
