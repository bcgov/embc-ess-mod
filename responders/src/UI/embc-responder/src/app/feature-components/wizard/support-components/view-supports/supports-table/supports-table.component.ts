import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Support, SupportStatus } from 'src/app/core/api/models';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { StepSupportsService } from '../../../step-supports/step-supports.service';

@Component({
  selector: 'app-supports-table',
  templateUrl: './supports-table.component.html',
  styleUrls: ['./supports-table.component.scss']
})
export class SupportsTableComponent
  implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() supportList: Support[];
  @Input() showLoader: boolean;
  @Input() filterTerm: TableFilterValueModel;
  @Output() clickedRow = new EventEmitter<Support>(null);

  displayedColumns: string[] = [
    'id',
    'category',
    'from',
    'to',
    'supplierName',
    'totalAmount',
    'status'
  ];
  dataSource = new MatTableDataSource();
  color = '#169BD5';
  data: any;

  constructor(
    private cd: ChangeDetectorRef,
    private stepSupportsService: StepSupportsService
  ) {}

  /**
   * Listens to input events and popluate values
   *
   * @param changes input event change object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportList) {
      this.dataSource = new MatTableDataSource(this.supportList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cd.detectChanges();
    }

    if (changes.filterTerm && this.filterTerm !== undefined) {
      this.filter(this.filterTerm);
    }
  }

  ngOnInit(): void {}

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

  teamFilterPredicate = (data: any, filter: string): boolean => {
    const searchString: TableFilterValueModel = JSON.parse(filter);
    if (searchString.type === 'status') {
      if (
        data.status
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1
      ) {
        return true;
      }
    } else if (searchString.type === 'type') {
      if (
        data.category
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1
      ) {
        return true;
      }
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

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      let category = this.stepSupportsService.supportCategory.find(
        (value) => value.value === element?.category
      );
      return category?.description;
    } else {
      let subCategory = this.stepSupportsService.supportSubCategory.find(
        (value) => value.value === element?.subCategory
      );
      return subCategory?.description;
    }
  }
}
