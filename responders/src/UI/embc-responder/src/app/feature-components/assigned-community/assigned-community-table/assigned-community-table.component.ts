import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { LoadEvacueeListService } from '../../../core/services/load-evacuee-list.service';

@Component({
  selector: 'app-assigned-community-table',
  templateUrl: './assigned-community-table.component.html',
  styleUrls: ['./assigned-community-table.component.scss']
})
export class AssignedCommunityTableComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData: TeamCommunityModel[] = [];
  @Input() filterTerm: TableFilterValueModel;
  @Input() filterPredicate: any;
  @Input() disableRow = false;
  @Input() isLoading: boolean;
  @Input() existingSelection: TeamCommunityModel[];
  @Output() selectedRows = new EventEmitter<any[]>();

  dataSource = new MatTableDataSource();
  columns: string[];
  selection = new SelectionModel<any>(true, []);
  color = '#169BD5';

  constructor(
    private cd: ChangeDetectorRef,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

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
      if (
        this.existingSelection !== undefined &&
        this.existingSelection.length > 0
      ) {
        this.dataSource.filteredData.forEach((row) => {
          const r: TeamCommunityModel = row;
          for (const sel of this.existingSelection) {
            if (sel.code === r.code) {
              this.selection.select(row);
            }
          }
        });
      }
      this.cd.detectChanges();
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
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Disables the row that is already assigned to the team
   *
   * @param row community model
   * @returns true/false
   */
  disable(row?): boolean {
    if (this.disableRow) {
      return !row?.allowSelect;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.disableRow) {
      if (this.selection.selected.length !== 0) {
        this.selection.clear();
      } else {
        this.dataSource.filteredData.forEach((row) => {
          if (row.hasOwnProperty('allowSelect')) {
            const r: TeamCommunityModel = row;
            if (r.allowSelect) {
              this.selection.select(row);
            }
          }
        });
      }
    } else {
      if (this.selection.selected.length !== 0 || this.isAllSelected()) {
        this.selection.clear();
      } else {
        this.dataSource.filteredData.forEach((row) => {
          if (row.hasOwnProperty('allowSelect')) {
            const r: TeamCommunityModel = row;
            this.selection.select(row);
          }
        });
      }
    }

    this.selectedRows.emit(this.selection.selected);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /**
   * Emits the selected communities to parent component
   *
   * @param row community model
   */
  selectionToggle(row): void {
    this.selection.toggle(row);
    this.selectedRows.emit(this.selection.selected);
  }

  getCommunitTypeDescription(communityOption: string): string {
    return this.loadEvacueeListService
      .getCommunityTypes()
      .find((type) => type.value === communityOption).description;
  }
}
