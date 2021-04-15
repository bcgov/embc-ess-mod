import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TeamMemberModel } from 'src/app/core/models/team-member.model';

@Component({
  selector: 'app-team-member-table',
  templateUrl: './team-member-table.component.html',
  styleUrls: ['./team-member-table.component.scss']
})
export class TeamMemberTableComponent implements AfterViewInit, OnChanges {

  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData = [];
  @Input() filterTerm: TableFilterValueModel;
  @Input() isLoading: boolean;
  @Input() statusLoading: boolean;
  @Input() loggedInRole: string;
  @Output() toggleActive = new EventEmitter<string>();
  @Output() toggleInactive = new EventEmitter<string>();
  @Output() clickedRow = new EventEmitter<TeamMember>();

  dataSource = new MatTableDataSource();
  columns: string[];
  color = '#169BD5';
  data: any;
  selectedIndex: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incomingData) {
      this.dataSource = new MatTableDataSource(this.incomingData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (changes.displayedColumns) {
      this.columns = this.displayedColumns.map(column => column.ref);
    }
    if (changes.filterTerm && this.filterTerm !== undefined) {
      this.filter(this.filterTerm);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(term: TableFilterValueModel): void {
    this.data = this.dataSource.filteredData;
    this.dataSource.filterPredicate = this.teamFilterPredicate;
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  teamFilterPredicate = (data: TeamMemberModel, filter: string): boolean => {
    const searchString: TableFilterValueModel = JSON.parse(filter);
    if (searchString.type === 'text') {
      if (data.lastName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
        data.userName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1) {
        return true;
      }
    }
    else if (searchString.type === 'array') {
      const terms = searchString.value.split(',');
      const roleTerm = terms[0];
      const statusTerm = terms[1];
      const labelTerm = terms[2];
      const matchFilter = [];
      const isActive = data.isActive === true ? 'Active' : 'Deactivated';
      const roleBoolean = data.roleDescription.trim().toLowerCase().indexOf(roleTerm.trim().toLowerCase()) !== -1;
      const statusBoolean = isActive.trim().toLowerCase().indexOf(statusTerm.trim().toLowerCase()) !== -1;
      const labelBoolean = data.labelDescription.trim().toLowerCase().indexOf(labelTerm.trim().toLowerCase()) !== -1;
      matchFilter.push(roleBoolean);
      matchFilter.push(statusBoolean);
      matchFilter.push(labelBoolean);
      return matchFilter.every(Boolean);
    }
  }

  rowClicked(row): void {
    this.clickedRow.emit(row);
  }

  disableRowInteraction($event, columnLabel): void {
    if (columnLabel === 'isActive') {
      $event.stopPropagation();
    }
  }

  slideToggle($event: MatSlideToggleChange, row, index): void {
    this.selectedIndex = index
    if ($event.checked) {
      this.toggleActive.emit(row.id);
    } else {
      this.toggleInactive.emit(row.id);
    }
  }

  isToggleAllowed(row: TeamMember): boolean {
    if(this.loggedInRole === 'Tier2'){
      if(row.role === 'Tier1') {
        return true;
      } else {
        return false
      }
    } else if(this.loggedInRole === 'Tier3') {
      if(row.role === 'Tier1' || row.role === 'Tier2') {
        return true;
      } else {
        return false
      }
    } else if(this.loggedInRole === 'Tier4') {
      if(row.role === 'Tier1' || row.role === 'Tier2' || row.role === 'Tier3') {
        return true;
      } else {
        return false
      }
    }
  }

}

// enum TIER2ALLOWED {
//   TIER1
// }

// enum TIER3ALLOWED {
//   TIER1,
//   TIER2
// }

// enum TIER4ALLOWED {
//   TIER1,
//   TIER2,
//   TIER3
// }

// enum AllRoles {
//   None,
//   TIER1,
//   TIER2 = checkForAllowed(),
//   TIER3,
//   TIER4

// }

// function checkForAllowed(): number {
    
// }
