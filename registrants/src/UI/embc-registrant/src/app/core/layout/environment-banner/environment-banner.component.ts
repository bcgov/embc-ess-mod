import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentInformation } from '../../model/environment-information.model';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss']
})
export class EnvironmentBannerComponent {
  @Input() environment?: EnvironmentInformation;

  constructor() {}
}
