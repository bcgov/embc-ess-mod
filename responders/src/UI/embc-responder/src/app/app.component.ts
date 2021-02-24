import { Component } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';
import { LoadLocationsService } from './core/services/load-locations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(apiConfig: ApiConfiguration, private loadLocationService: LoadLocationsService) {
    apiConfig.rootUrl = '';
    this.loadLocations();
  }

  loadLocations() {
    this.loadLocationService.getCommunityList();
    this.loadLocationService.getCountriesList();
    this.loadLocationService.getStateProvinceList();
  }
}
