import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { LoadLocationsService } from 'src/app/core/services/load-locations.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit{

    constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private loadLocationService: LoadLocationsService) { }

    ngOnInit(): void {
        this.communities = this.loadLocationService.getCommunityList();
    }

    regionalDistrictList: string[] = ['Cariboo', 'Victoria', 'Comox Valley'];
    typesList: string[] = ['First Nations Community', 'City'];
    communities: Community[];
    filterTerm: TableFilterValueModel;
    selectedCommunitiesList: Community[];

    filter(event: TableFilterValueModel) {
        this.filterTerm = event;
      }

    filtersToLoad: TableFilterModel = {
        loadDropdownFilters: [{
          type: 'regionalDistrict',
          label: 'All Regional Districts',
          values: this.regionalDistrictList
        }],
        loadInputFilter: {
          type: 'Search by city, town, village or community',
          label: 'Search by city, town, village or community'
        }
      }

      displayedColumns: TableColumnModel[] = [
        { label: 'select', ref: 'select' },
        { label: 'Community', ref: 'name' },
        { label: 'Regional District', ref: 'districtName' },
        { label: 'Type', ref: 'type' }
      ];

    buttonAction(action: string): void {
        this.dialogRef.close(action);
    }

    selectedCommunities($event) {
        this.selectedCommunitiesList = $event;
    }

    addToMyList() {
        console.log(this.selectedCommunitiesList);
    }

}
