import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {

  @Output() filterEvent = new EventEmitter<TableFilterValueModel>();
  @Input() filtersToLoad: TableFilterModel;
  searchTerm: string;
  @ViewChildren('matRef') matRef: QueryList<MatSelect>;

  constructor() { }

  ngOnInit(): void {
  }

  selected(event: MatSelectChange, filterType: string): void {
    this.resetTextField();
    let filterArray = [];
    this.matRef.forEach((select: MatSelect) => {
      //console.log(select.value)
      filterArray.push(select.value === undefined ? '' : (select.value.description !== undefined ? select.value.description : select.value));
    });
    //console.log(filterArray.join(","));
    this.filterEvent.emit({ type: 'array', value:filterArray.join(",")});
    // if(event.value.description !== undefined) {
    //   this.filterEvent.emit({ type: filterType, value: event.value.description });
    // } else {
    //   this.filterEvent.emit({ type: filterType, value: event.value });
    // }
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
