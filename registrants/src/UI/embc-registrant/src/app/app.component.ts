import { Component } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';
import { LocationService } from './core/services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    apiConfig: ApiConfiguration,
    private locationService: LocationService
  ) {
    apiConfig.rootUrl = '';
    this.loadStaticLists();
  }

  private loadStaticLists(): void {
    this.locationService.getCommunityList();
    this.locationService.getCountriesList();
    this.locationService.getRegionalDistricts();
    this.locationService.getStateProvinceList();
  }
}
