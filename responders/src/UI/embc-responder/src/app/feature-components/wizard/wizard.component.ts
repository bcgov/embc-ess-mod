import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { ExitWizardDialogComponent } from 'src/app/shared/components/dialog-components/exit-wizard-dialog/exit-wizard-dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { WizardService } from './wizard.service';
import { Subscription } from 'rxjs';

import * as globalConst from '../../core/services/global-constants';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, OnDestroy {
  sideNavMenu: Array<WizardSidenavModel> = new Array<WizardSidenavModel>();
  scrollSubscription: Subscription;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private cacheService: CacheService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    const params = this.route.snapshot.queryParams;
    if (params && params.type) {
      this.sideNavMenu = this.wizardService.getMenuItems(params.type);
    } else {
      this.sideNavMenu = this.wizardService.menuItems;
    }
  }

  ngOnInit(): void {
    this.loadDefaultStep();

    // Scroll to top when navigating. "scrollPositionRestoration" option doesn't work for Mat-Sidenav-Content.
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        document
          .querySelector('.mat-sidenav-content')
          .scroll({ left: 0, top: 0 });
      }
    });
  }

  /**
   * Constructs the first step to be loaded by the wizard
   */
  loadDefaultStep(): void {
    if (this.sideNavMenu !== null && this.sideNavMenu !== undefined) {
      const firstStepUrl = this.sideNavMenu[0].route;
      const firstStepId = this.sideNavMenu[0].step;
      const firstStepTitle = this.sideNavMenu[0].title;

      this.router.navigate([firstStepUrl], {
        state: { step: firstStepId, title: firstStepTitle }
      });
    }
  }

  /**
   * Allows navigation if the step is not locked else
   * displays modal window
   *
   * @param lockedIndicator
   * @param $event
   */
  goToStep(lockedIndicator: boolean, $event: MouseEvent): void {
    if (lockedIndicator) {
      $event.stopPropagation();
      $event.preventDefault();

      const curStep = this.wizardService.getCurrentStep(this.router.url);
      console.log(curStep);

      const lockedMsg =
        this.wizardService.menuItems[curStep]?.incompleteMsg ||
        globalConst.stepIncompleteMessage;

      this.openLockedModal(lockedMsg);
    }
  }

  /**
   * Exits the wizards and navigates to last page
   */
  exit(): void {
    const navigateTo = this.cacheService.get('wizardOpenedFrom');
    this.openExitModal(navigateTo);
  }

  /**
   * Opens exit modal window
   *
   * @param navigateTo navigateTo url
   */
  openExitModal(navigateTo: string): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: ExitWizardDialogComponent
        },
        height: '270px',
        width: '530px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'exit') {
          this.router.navigate([navigateTo]);
        }
      });
  }

  /**
   * Opens information modal to display the step
   * locked message
   *
   * @param text message to display
   */
  openLockedModal(text: string, title?: string) {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text,
        title
      },
      width: '530px'
    });
  }

  /**
   * When wizard is closed, end Angular Material "scroll to top" subscription
   */
  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }
}
