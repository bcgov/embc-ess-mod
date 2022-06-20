import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { WizardService } from './wizard.service';
import * as globalConst from '../../core/services/global-constants';
import { WizardAdapterService } from './wizard-adapter.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, OnDestroy {
  sideNavMenu: Array<WizardSidenavModel> = new Array<WizardSidenavModel>();

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private cacheService: CacheService,
    private cd: ChangeDetectorRef,
    private wizardAdapterService: WizardAdapterService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {
    this.sideNavMenu = this.appBaseService?.wizardProperties?.wizardMenu;
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
    const curStep = this.wizardService.getCurrentStep(this.router.url);
    if (lockedIndicator) {
      $event.stopPropagation();
      $event.preventDefault();

      const lockedMsg =
        this.wizardService.menuItems[curStep]?.incompleteMsg ||
        globalConst.stepIncompleteMessage;

      this.wizardService.openLockedModal(lockedMsg);
    } else if (
      !lockedIndicator &&
      (this.router.url === '/ess-wizard/add-supports/details' ||
        this.router.url === '/ess-wizard/add-supports/delivery')
    ) {
      $event.stopPropagation();
      $event.preventDefault();

      this.wizardService.openWarningModal(
        globalConst.supportInProgressMessage,
        targetRoute
      );
    }
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
    this.clearCachedServices();
  }

  private clearCachedServices() {
    this.cacheService.remove('wizardMenu');
    this.cacheService.remove('wizardType');
    this.appBaseService.wizardProperties = {
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }
}
