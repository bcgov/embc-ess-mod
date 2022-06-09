import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MemberRole, TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TeamMemberModel } from 'src/app/core/models/team-member.model';

@Component({
  selector: 'app-team-member-table',
  templateUrl: './team-member-table.component.html',
  styleUrls: ['./team-member-table.component.scss']
})
export class TeamMemberTableComponent implements AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData: TeamMember[] = [];
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

  /**
   * Listens to input events and popluate values
   *
   * @param changes input event change object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incomingData) {
      this.dataSource = new MatTableDataSource(this.incomingData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (changes.displayedColumns) {
      this.columns = this.displayedColumns.map((column) => column.ref);
    }
    if (changes.filterTerm && this.filterTerm !== undefined) {
      this.filter(this.filterTerm);
    }
  }

  /**
   * Sets paginator and sort on tables
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Filters the datatable
   *
   * @param term user selected filters
   */
  filter(term: TableFilterValueModel): void {
    this.data = this.dataSource.filteredData;
    this.dataSource.filterPredicate = this.teamFilterPredicate;
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * custom filter predicate for string and dropdown filters
   *
   * @param data table data
   * @param filter filter term
   * @returns true/false
   */
  teamFilterPredicate = (data: TeamMemberModel, filter: string): boolean => {
    const searchString: TableFilterValueModel = JSON.parse(filter);
    if (searchString.type === 'text') {
      if (
        data.lastName
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
        data.userName
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1
      ) {
        return true;
      }
    } else if (searchString.type === 'array') {
      const terms = searchString.value.split(',');
      const roleTerm = terms[0];
      const statusTerm = terms[1];
      const labelTerm = terms[2];
      const matchFilter = [];
      const isActive = data.isActive === true ? 'Active' : 'Deactivated';
      const roleBoolean =
        data.roleDescription
          .trim()
          .toLowerCase()
          .indexOf(roleTerm.trim().toLowerCase()) !== -1;
      const statusBoolean =
        isActive
          .trim()
          .toLowerCase()
          .indexOf(statusTerm.trim().toLowerCase()) !== -1;
      const labelBoolean =
        labelTerm === ''
          ? true
          : data.labelDescription === null ||
            data.labelDescription === undefined
          ? false
          : data.labelDescription
              .trim()
              .toLowerCase()
              .indexOf(labelTerm.trim().toLowerCase()) !== -1 &&
            data.labelDescription.trim().length === labelTerm.trim().length;

      matchFilter.push(roleBoolean);
      matchFilter.push(statusBoolean);
      matchFilter.push(labelBoolean);
      return matchFilter.every(Boolean);
    }
  };

  /**
   * Captures the row click event
   *
   * @param row team member row
   */
  rowClicked(row): void {
    this.clickedRow.emit(row);
  }

  /**
   * Stops the entire row from being clicked if the user interacts with
   * the toggle button
   *
   * @param $event click event
   * @param columnLabel table column name
   */
  disableRowInteraction($event, columnLabel): void {
    if (columnLabel === 'isActive') {
      $event.stopPropagation();
    }
  }

  /**
   * Emits active/inactive events based on user interaction with the toggle
   *
   * @param $event slide toggle event
   * @param row row affected
   * @param index index of the affected row
   */
  slideToggle($event: MatSlideToggleChange, row, index): void {
    this.selectedIndex = index;
    if ($event.checked) {
      this.toggleActive.emit(row.id);
    } else {
      this.toggleInactive.emit(row.id);
    }
  }

  /**
   * Role based access to toggle users active/inactive
   *
   * @param row selected row
   * @returns true/false
   */
  isToggleAllowed(row: TeamMember): boolean {
    if (this.loggedInRole === MemberRole.Tier2) {
      return row.role === MemberRole.Tier1 ? true : false;
    } else if (this.loggedInRole === MemberRole.Tier3) {
      return row.role === MemberRole.Tier1 || row.role === MemberRole.Tier2
        ? true
        : false;
    } else if (this.loggedInRole === MemberRole.Tier4) {
      return row.role === MemberRole.Tier1 ||
        row.role === MemberRole.Tier2 ||
        row.role === MemberRole.Tier3
        ? true
        : false;
    }
  }
}
