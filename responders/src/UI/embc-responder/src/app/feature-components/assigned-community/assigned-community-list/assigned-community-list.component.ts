import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { AssignedCommunityListDataService } from './assigned-community-list-data.service';
import { AssignedCommunityListService } from './assigned-community-list.service';

@Component({
  selector: 'app-assigned-community-list',
  templateUrl: './assigned-community-list.component.html',
  styleUrls: ['./assigned-community-list.component.scss']
})
export class AssignedCommunityListComponent implements OnInit {

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  assignedCommunities: Community[];
  displayedColumns: TableColumnModel[];
  newRow: Community = { name: 'Add New Community' }

  constructor(private assignedCommunityListService: AssignedCommunityListService,
    private assignedCommunityListDataService: AssignedCommunityListDataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.assignedCommunityListService.getAssignedCommunityList().subscribe(values => {
      console.log(values);
      values.splice(0, 0, this.newRow);
      this.assignedCommunities = values;
    });

    this.filtersToLoad = this.assignedCommunityListDataService.filtersToLoad;
    this.displayedColumns = this.assignedCommunityListDataService.displayedColumns;
  }

  filter(event: TableFilterValueModel) {
    this.filterTerm = event;
  }

  addCommunities($event: boolean) {
    console.log($event)
    if ($event) {
      this.dialog.open(DialogComponent, {
        //height: '800px',
        //width: '800px'
      });
    }
  }

}





  // sampleCommunityData = [
  //   { name: 'Community Name', regionalDistrict: 'Cariboo', type: 'First Nations Community', date: 'mm/dd/yyyy' },
  //   { community: 'Community Name', regionalDistrict: 'Victoria', type: 'City', date: 'mm/dd/yyyy' },
  //   { community: 'Community Name', regionalDistrict: 'Cariboo', type: 'First Nations Community', date: 'mm/dd/yyyy' }
  // ];