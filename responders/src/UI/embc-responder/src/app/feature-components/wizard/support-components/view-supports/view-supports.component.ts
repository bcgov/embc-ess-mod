import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Support } from 'src/app/core/api/models';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import { ViewSupportsService } from './view-supports.service';

@Component({
  selector: 'app-view-supports',
  templateUrl: './view-supports.component.html',
  styleUrls: ['./view-supports.component.scss']
})
export class ViewSupportsComponent implements OnInit {
  supportList: Support[];
  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private viewSupportsService: ViewSupportsService
  ) {}

  ngOnInit(): void {
    this.supportList = this.stepSupportsService.existingSupportList.sort(
      (a, b) => new Date(b.from).valueOf() - new Date(a.from).valueOf()
    );

    this.filtersToLoad = this.viewSupportsService.load();
  }

  addSupports() {
    this.router.navigate(['/ess-wizard/add-supports/select-support']);
  }

  process() {}

  selected(event: MatSelectChange, filterType: string): void {
    let selectedValue =
      event.value === undefined || event.value === ''
        ? ''
        : event.value.description;
    this.filterTerm = { type: filterType, value: selectedValue };
  }
}
