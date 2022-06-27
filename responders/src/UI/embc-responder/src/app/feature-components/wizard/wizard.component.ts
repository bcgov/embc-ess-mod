import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { WizardService } from './wizard.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { WizardAdapterService } from './wizard-adapter.service';

/**
 * Initializes the wizard layout by loading the appropriate wizard menu
 * based on selected user functionality.
 * Defines navigation rules within and outside the wizard
 */
@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, OnDestroy {
  sideNavMenu: Array<WizardSidenavModel> = new Array<WizardSidenavModel>();

  constructor(
    private wizardService: WizardService,
    private cd: ChangeDetectorRef,
    private appBaseService: AppBaseService,
    private wizardAdapterService: WizardAdapterService
  ) {
    this.sideNavMenu = this.appBaseService?.wizardProperties?.wizardMenu;
    this.wizardService.menuItems =
      this.appBaseService?.wizardProperties?.wizardMenu;
  }

  ngOnInit(): void {
    this.wizardService.loadDefaultStep(this.sideNavMenu);
    this.cd.detectChanges();
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
    this.wizardService.manageStepNavigation(
      lockedIndicator,
      $event,
      targetRoute
    );
  }

  /**
   * Exits the wizards and navigates to last page
   */
  exit(): void {
    const navigateTo = this.appBaseService?.wizardProperties?.exitLink;
    this.wizardService.openExitModal(navigateTo);
  }

  /**
   * When wizard is closed, end Angular Material "scroll to top" subscription
   */
  ngOnDestroy() {
    this.wizardAdapterService.clearWizard();
    this.wizardService.clearCachedServices();
  }
}
