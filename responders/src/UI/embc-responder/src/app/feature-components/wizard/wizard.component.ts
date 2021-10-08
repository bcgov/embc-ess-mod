import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { WizardService } from './wizard.service';
import { Subscription } from 'rxjs';
import * as globalConst from '../../core/services/global-constants';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { WizardAdapterService } from './wizard-adapter.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';

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
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private wizardAdapterService: WizardAdapterService,
    private evacueeSessionService: EvacueeSessionService
  ) {
    const params = this.route.snapshot.queryParams;
    if (params && params.type) {
      this.wizardService.setDefaultMenuItems(params.type);
    }
    this.sideNavMenu = this.wizardService.menuItems;
  }

  ngOnInit(): void {
    this.loadDefaultStep();
    this.cd.detectChanges();

    // Scroll to top when navigating. "scrollPositionRestoration" option doesn't work for Mat-Sidenav-Content.
    this.scrollSubscription = this.router.events.subscribe((ev: any) => {
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
  goToStep(
    lockedIndicator: boolean,
    $event: MouseEvent,
    targetRoute: string
  ): void {
    const curStep = this.wizardService.getCurrentStep(this.router.url);
    if (lockedIndicator) {
      $event.stopPropagation();
      $event.preventDefault();

      const lockedMsg =
        this.wizardService.menuItems[curStep]?.incompleteMsg ||
        globalConst.stepIncompleteMessage;

      this.openLockedModal(lockedMsg);
    } else if (
      !lockedIndicator &&
      (this.router.url === '/ess-wizard/add-supports/details' ||
        this.router.url === '/ess-wizard/add-supports/delivery')
    ) {
      $event.stopPropagation();
      $event.preventDefault();

      this.openWarningModal(globalConst.supportInProgressMessage, targetRoute);
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
          component: InformationDialogComponent,
          content: globalConst.exitWizardDialog
        },
        width: '530px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate([navigateTo]);
          //.then(() => this.wizardStepService.clearWizard());
        }
      });
  }

  /**
   * Opens information modal to display the step
   * locked message
   *
   * @param text message to display
   */
  openLockedModal(content: DialogContent, title?: string) {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content,
        title
      },
      width: '530px'
    });
  }

  /**
   * Opens information modal to display the support step
   * warning message
   *
   * @param text message to display
   */
  openWarningModal(content: DialogContent, navigateTo: string) {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content
        },
        width: '530px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate([navigateTo]);
        }
      });
  }

  /**
   * When wizard is closed, end Angular Material "scroll to top" subscription
   */
  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
    this.wizardAdapterService.clearWizard();
    this.clearCachedServices();
  }

  private clearCachedServices() {
    this.cacheService.remove('wizardMenu');
    this.cacheService.remove('wizardType');
    this.cacheService.remove('wizardOpenedFrom');
    this.evacueeSessionService.setMemberFlag(null);
    this.evacueeSessionService.setEditWizardFlag(null);
  }
}
