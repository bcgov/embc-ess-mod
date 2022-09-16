import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EvacueeSearchService } from '../search/evacuee-search/evacuee-search.service';
import { WizardAdapterService } from './wizard-adapter.service';

@Injectable({ providedIn: 'root' })
export class WizardActivateGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private evacueeSearchService: EvacueeSearchService,
    private wizardAdapterService: WizardAdapterService,
    private router: Router,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const loggedInTaskNumber = this.cacheService.get('loggedInTaskNumber');
    const wizardType = this.appBaseService?.wizardProperties?.wizardType;
    const registrantProfileId =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.id;

    if (wizardType === WizardType.NewRegistration) {
      if (this.isNewRegistrationAllowed(loggedInTaskNumber)) {
        this.appBaseService.appModel = {
          selectedProfile: { selectedEvacueeInContext: null }
        };
        this.appBaseService.appModel.selectedEssFile = null;
        this.computeState.triggerEvent();

        this.wizardAdapterService.stepCreateProfileFromSearch();

        return true;
      }

      return false;
    } else if (wizardType === WizardType.EditRegistration) {
      if (this.isProfileIdNotNull(registrantProfileId)) {
        return this.wizardAdapterService.stepEditProfileFromProfileId(
          registrantProfileId
        );
      }

      return false;
    } else if (wizardType === WizardType.NewEssFile) {
      if (this.isProfileIdNotNull(registrantProfileId)) {
        return this.wizardAdapterService.stepCreateEssFileFromProfileId(
          registrantProfileId
        );
      }

      return false;
    } else if (wizardType === WizardType.MemberRegistration) {
      if (this.isProfileCreationAllowed()) {
        this.wizardAdapterService.stepCreateProfileForMembers();
        return true;
      }
      return false;
    } else if (wizardType === WizardType.ReviewFile) {
      if (this.isFileReviewAllowed()) {
        return this.wizardAdapterService.stepReviewESSFileFromESSFileRecord();
      }
      return false;
    } else if (wizardType === WizardType.CompleteFile) {
      if (this.isFileCompletionAllowed()) {
        return this.wizardAdapterService.stepCompleteESSFileFromESSFileRecord();
      }
      return false;
    } else if (wizardType === WizardType.ExtendSupports) {
      if (this.isExtendSupportsAllowed()) {
        return this.wizardAdapterService.stepExtendSupportsFromESSFileRecord();
      }
      return false;
    } else if (wizardType === WizardType.CaseNotes) {
      if (this.isCaseNotesAllowed()) {
        return true;
      }
      return false;
    } else {
      this.router.navigate(['/responder-access']);
    }
  }

  private isNewRegistrationAllowed(loggedInTaskNumber: string): boolean {
    return (
      loggedInTaskNumber !== null &&
      loggedInTaskNumber !== undefined &&
      this.evacueeSearchService?.evacueeSearchContext
        ?.evacueeSearchParameters !== null &&
      this.evacueeSearchService?.evacueeSearchContext
        ?.evacueeSearchParameters !== undefined
    );
  }

  private isProfileIdNotNull(registrantProfileId: string): boolean {
    return registrantProfileId !== null && registrantProfileId !== undefined;
  }

  private isProfileCreationAllowed(): boolean {
    return (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    );
  }

  private isFileReviewAllowed(): boolean {
    return (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    ); // add file status for review
  }

  private isFileCompletionAllowed(): boolean {
    return (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    ); // add file status for complete
  }

  private isExtendSupportsAllowed(): boolean {
    return (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    );
  }

  private isCaseNotesAllowed(): boolean {
    return (
      this.appBaseService?.appModel?.selectedEssFile?.id !== null &&
      this.appBaseService?.appModel?.selectedEssFile?.id !== undefined
    );
  }
}
