import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { MatOption } from '@angular/material/core';

import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatButton, MatSelect, MatOption]
})
export class SearchFilterComponent {
  @ViewChildren('matRef') matRef: QueryList<MatSelect>;
  @Output() filterEvent = new EventEmitter<TableFilterValueModel>();
  @Input() filtersToLoad: TableFilterModel;
  searchTerm: string;

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
