import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepEssFileService } from './step-ess-file.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgClass } from '@angular/common';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-step-ess-file',
  templateUrl: './step-ess-file.component.html',
  styleUrls: ['./step-ess-file.component.scss'],
  standalone: true,
  imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, NgClass, AlertComponent, MatTabNavPanel, RouterOutlet]
})
export class StepEssFileComponent implements OnInit {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService
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

    this.tabs = this.stepEssFileService.essTabs;
  }

  ngOnInit() {
    this.stepEssFileService.createNeedsForm();
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   */
  isAllowed(tabRoute: string, $event: MouseEvent): void {
    this.stepEssFileService.nextTabUpdate.next();
    this.stepEssFileService.isAllowed(tabRoute, $event);
  }
}
