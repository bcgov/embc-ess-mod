import { Component, OnInit } from '@angular/core';
import { LocationsService } from 'src/app/core/services/locations.service';

@Component({
  selector: 'app-responder-access',
  templateUrl: './responder-access.component.html',
  styleUrls: ['./responder-access.component.scss']
})
export class ResponderAccessComponent implements OnInit {
  constructor(private locationService: LocationsService) {}

  ngOnInit(): void {
    this.loadLists();
  }

  private loadLists(): void {
    this.locationService.getCommunityList();
    this.locationService.getCountriesList();
    this.locationService.getRegionalDistricts();
    this.locationService.getStateProvinceList();
  }
}
