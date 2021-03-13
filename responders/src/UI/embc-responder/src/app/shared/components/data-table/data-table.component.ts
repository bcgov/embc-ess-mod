import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements AfterViewInit, OnChanges, OnInit {

  // add optional clickable rows

  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData = [];
  @Input() filterTerm: TableFilterValueModel;
  @Input() filterPredicate: any;
  @Input() disableRow = false;
  @Input() allowClickableRows: boolean;
  @Output() selectedRows = new EventEmitter<any[]>();
  @Output() toggleActive = new EventEmitter<string>();
  @Output() toggleInactive = new EventEmitter<string>();
  @Output() clickedRow = new EventEmitter<{}>();


  dataSource = new MatTableDataSource();
  columns: string[];
  selection = new SelectionModel<any>(true, []);
  isLoading = true;
  color = '#169BD5';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

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
  }

  filter(term: TableFilterValueModel): void {
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  disable(row?): boolean {
    // this.disableRow = true;
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
        this.dataSource.filteredData.forEach(row => {
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
        this.dataSource.filteredData.forEach(row => {
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectionToggle(row): void {
    this.selection.toggle(row);
    this.selectedRows.emit(this.selection.selected);
  }

  rowClicked(row): void {
    if (this.allowClickableRows) {
      console.log(row);
      this.clickedRow.emit(row);
    }
  }

  disableRowInteraction($event, columnLabel): void {
    if (columnLabel === 'isActive') {
      $event.stopPropagation();
    }
  }

  slideToggle($event: MatSlideToggleChange, row): void {
    console.log($event);
    console.log(row);
    if ($event.checked) {
      this.toggleActive.emit(row.id);
    } else {
      this.toggleInactive.emit(row.id);
    }
  }
}
