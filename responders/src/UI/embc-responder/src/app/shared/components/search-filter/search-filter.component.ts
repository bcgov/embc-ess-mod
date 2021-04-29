import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @ViewChildren('matRef') matRef: QueryList<MatSelect>;
  @Output() filterEvent = new EventEmitter<TableFilterValueModel>();
  @Input() filtersToLoad: TableFilterModel;
  searchTerm: string;

  constructor() {}

  ngOnInit(): void {}

  selected(event: MatSelectChange, filterType: string): void {
    this.resetTextField();
    const filterArray = [];
    this.matRef.forEach((select: MatSelect) => {
      filterArray.push(
        select.value === undefined
          ? ''
          : select.value.description !== undefined
          ? select.value.description
          : select.value
      );
    });
    this.filterEvent.emit({ type: 'array', value: filterArray.join(',') });
  }

  search(): void {
    this.resetSelects();
    this.filterEvent.emit({ type: 'text', value: this.searchTerm });
  }

  resetAllFilters(): void {
    this.resetSelects();
    this.resetTextField();
  }

  private resetSelects(): void {
    this.matRef.forEach((select: MatSelect) => {
      select.value = '';
    });
  }

  private resetTextField(): void {
    this.searchTerm = '';
    this.filterEvent.emit({ type: 'text', value: this.searchTerm });
  }
}
