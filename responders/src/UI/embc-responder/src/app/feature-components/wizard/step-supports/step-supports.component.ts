import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepSupportsService } from './step-supports.service';

@Component({
  selector: 'app-step-supports',
  templateUrl: './step-supports.component.html',
  styleUrls: ['./step-supports.component.scss']
})
export class StepSupportsComponent implements OnInit {
  stepName: string;
  stepId: string;

  constructor(
    private router: Router,
    private stepSupportsService: StepSupportsService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          step: string;
          title: string;
        };
        this.stepId = state.step;
        this.stepName = state.title;
      }
    }
  }

  ngOnInit(): void {
    this.stepSupportsService.getCategoryList();
    this.stepSupportsService.getSubCategoryList();
    this.stepSupportsService.getEvacFile();
    this.stepSupportsService.getSupplierList().subscribe((value) => {
      this.stepSupportsService.supplierList = value;
    });
  }
}
