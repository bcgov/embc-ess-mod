import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  dataSource = new MatTableDataSource();
  columns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incomingData) {
      this.dataSource = new MatTableDataSource(this.incomingData);
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(term: TableFilterValueModel) {
    console.log(term)
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
