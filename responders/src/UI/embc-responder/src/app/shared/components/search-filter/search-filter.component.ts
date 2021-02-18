import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnChanges {

  @Output() filterTerm = new EventEmitter<TableFilterValueModel>();
  @Input() filtersToLoad: TableFilterModel[];
  rolesList: string[] = ['All User Roles', 'Tier 1 Responder', 'Tier 2 Superviser', 'Tier 3 ESSD', 'Tier 4 LEP'];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.filtersToLoad) {}
  }

  selected(event: MatSelectChange, filterType: string): void {
    console.log(filterType)
    if (event.value === 'All User Roles') {
      this.filterTerm.emit({ type: 'role', value: '' });
    } else {
      this.filterTerm.emit({ type: 'role', value: event.value });
    }
  }
}
