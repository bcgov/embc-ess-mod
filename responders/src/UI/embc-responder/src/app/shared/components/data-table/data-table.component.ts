import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from 'src/app/core/models/table-column.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnChanges {

  // add optional sorting, filtering and clickable rows

  @Input() displayedColumns: TableColumnModel[];
  @Input() incomingData = [];
  dataSource = new MatTableDataSource();
  columns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['incomingData']) {
      this.dataSource = new MatTableDataSource(this.incomingData);
    }
    if(changes['displayedColumns']) {
      this.columns = this.displayedColumns.map(column => column.ref);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}