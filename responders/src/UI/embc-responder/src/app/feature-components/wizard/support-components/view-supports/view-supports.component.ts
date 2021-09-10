import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Support, SupportStatus } from 'src/app/core/api/models';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import { ViewSupportsService } from './view-supports.service';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-view-supports',
  templateUrl: './view-supports.component.html',
  styleUrls: ['./view-supports.component.scss']
})
export class ViewSupportsComponent implements OnInit {
  supportList: Support[];
  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  showLoader = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private viewSupportsService: ViewSupportsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.showLoader = !this.showLoader;
    this.stepSupportsService.getExistingSupportList().subscribe(
      (value) => {
        this.showLoader = !this.showLoader;
        this.supportList = value;
        // const index = this.supportList.findIndex(
        //   (item) => (item.status = SupportStatus.Draft)
        // );
        // if (this.stepSupportsService.mealReferral && index === -1) {
        //   this.supportList.push(this.stepSupportsService.mealReferral);
        // }
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.supportListerror);
      }
    );
    this.filtersToLoad = this.viewSupportsService.load();
  }

  addSupports() {
    this.router.navigate(['/ess-wizard/add-supports/select-support']);
  }

  process() {}

  selected(event: MatSelectChange, filterType: string): void {
    const selectedValue =
      event.value === undefined || event.value === ''
        ? ''
        : event.value.description;
    this.filterTerm = { type: filterType, value: selectedValue };
  }

  openSupportDetails($event: Support): void {
    console.log($event);
    this.stepSupportsService.selectedSupportDetail = $event;
    this.router.navigate(['/ess-wizard/add-supports/view-detail']);
  }
}
