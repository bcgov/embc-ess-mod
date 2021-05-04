import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepCreateProfileService } from './step-create-profile.service';
import * as globalConst from '../../../core/services/global-constants';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';

@Component({
  selector: 'app-step-create-profile',
  templateUrl: './step-create-profile.component.html',
  styleUrls: ['./step-create-profile.component.scss']
})
export class StepCreateProfileComponent {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private dialog: MatDialog
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
    this.tabs = this.stepCreateProfileService.tabs;
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   * @returns true/false
   */
  isAllowed(tabRoute: string, $event: MouseEvent): boolean {
    if (tabRoute === 'review') {
      const allow = this.tabs.some(
        (tab) => tab.status === 'not-started' || tab.status === 'incomplete'
      );
      if (allow) {
        $event.stopPropagation();
        $event.preventDefault();
        this.openModal(globalConst.wizardProfileMessage);
      }
      return allow;
    }
  }

  /**
   * Open information modal window
   *
   * @param text text to display
   */
  openModal(text: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text
      },
      height: '230px',
      width: '530px'
    });
  }
}
