import { Component, Input } from '@angular/core';
import { EnvironmentInformation } from '../../models/environment-information.model';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss']
})
export class EnvironmentBannerComponent {
  @Input() environment?: EnvironmentInformation;

  constructor() {}
}
