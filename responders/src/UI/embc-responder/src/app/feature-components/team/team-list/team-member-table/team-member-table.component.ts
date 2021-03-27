import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  @Output() toggleActive = new EventEmitter<string>();
  @Output() toggleInactive = new EventEmitter<string>();
  @Output() clickedRow = new EventEmitter<TeamMember>();

  dataSource = new MatTableDataSource();
  columns: string[];
  isLoading = true;
  color = '#169BD5';
  data: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incomingData) {
      this.dataSource = new MatTableDataSource(this.incomingData);
      this.dataSource.paginator = this.paginator;
      console.log(this.isLoading);
      this.isLoading = !this.isLoading;
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
    // if(this.incomingData !== undefined) {
    //   if(this.incomingData.length !== 0) {
    //     this.isLoading = false;
    //   }
    // }
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
      let terms = searchString.value.split(',');
      let roleTerm = terms[0];
      let statusTerm = terms[1];
      let labelTerm = terms[2];
      const matchFilter = [];
      let isActive = data.isActive === true ? "Active" : "Deactivated";
      let roleBoolean = data.roleDescription.trim().toLowerCase().indexOf(roleTerm.trim().toLowerCase()) !== -1;
      let statusBoolean = isActive.trim().toLowerCase().indexOf(statusTerm.trim().toLowerCase()) !== -1
      let labelBoolean = data.labelDescription.trim().toLowerCase().indexOf(labelTerm.trim().toLowerCase()) !== -1;
      matchFilter.push(roleBoolean);
      matchFilter.push(statusBoolean);
      matchFilter.push(labelBoolean);
      return matchFilter.every(Boolean);
    }
  };

  rowClicked(row): void {
    this.clickedRow.emit(row);
  }

  disableRowInteraction($event, columnLabel): void {
    if (columnLabel === 'isActive') {
      $event.stopPropagation();
    }
  }

  slideToggle($event: MatSlideToggleChange, row): void {
    if ($event.checked) {
      this.toggleActive.emit(row.id);
    } else {
      this.toggleInactive.emit(row.id);
    }
  }

}
