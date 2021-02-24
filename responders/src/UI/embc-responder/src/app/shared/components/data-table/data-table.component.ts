import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnChanges, OnInit {

  // add optional clickable rows

  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData = [];
  @Input() filterTerm : TableFilterValueModel;
  @Input() filterPredicate: any;
  @Output() addEvent = new EventEmitter<boolean>(false);
  @Output() selectedRows = new EventEmitter<any[]>();
  dataSource = new MatTableDataSource();
  columns: string[];
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incomingData) {
      this.dataSource = new MatTableDataSource(this.incomingData);
      this.dataSource.paginator = this.paginator;
    }
    if (changes.displayedColumns) {
      this.columns = this.displayedColumns.map(column => column.ref);
    }
    if(changes.filterTerm && this.filterTerm !== undefined) {
      this.filter(this.filterTerm);
    }
    if(changes.filterPredicate) {
      console.log(this.filterPredicate)
      this.dataSource.filterPredicate = this.filterPredicate;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  filter(term: TableFilterValueModel) {
    console.log(term)
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  triggerEvent() {
    this.addEvent.emit(true);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectionToggle(row) {
    this.selection.toggle(row);
    this.selectedRows.emit(this.selection.selected)
    console.log(this.selection.selected)
  }
}
