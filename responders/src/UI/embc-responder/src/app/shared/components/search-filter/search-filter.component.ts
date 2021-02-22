import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnChanges {

  @Output() filterEvent = new EventEmitter<TableFilterValueModel>();
  @Input() filtersToLoad: TableFilterModel;
  searchTerm: string;
  @ViewChild('matRef') matRef: MatSelect;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filtersToLoad) { }
  }

  selected(event: MatSelectChange, filterType: string): void {
    console.log(filterType)
    console.log(event.value)
    // if (event.value === 'All User Roles') {
    //   this.filterEvent.emit({ type: filterType, value: '' });
    // } else {
      console.log("-----")
      this.filterEvent.emit({ type: filterType, value: event.value });
    //}
  }

  search(): void {
    this.filterEvent.emit({ type: '', value: this.searchTerm })
    this.filterEvent.emit({ type: 'text', value: this.searchTerm })
  }

  reset(): void {
    console.log(this.matRef)
    //this.matRef.options.forEach((data: MatOption) => data.deselect());
    this.searchTerm = ''
    this.filterEvent.emit();
  }

}
