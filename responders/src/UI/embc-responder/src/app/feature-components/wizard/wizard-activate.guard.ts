import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { EvacueeSearchService } from '../search/evacuee-search/evacuee-search.service';
import { WizardStepService } from './wizard-step.service';

@Injectable({ providedIn: 'root' })
export class WizardActivateGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private wizardStepService: WizardStepService,
    private router: Router
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const loggedInTask = this.cacheService.get('loggedInTask');
    const wizardType = this.evacueeSessionService.getWizardType();
    const registrantProfileId = this.evacueeSessionService.profileId;

    if (wizardType === 'new-registration') {
      if (this.isNewRegistrationAllowed(loggedInTask)) {
        this.wizardStepService.evacueeProfileStepFromSearch();

        return true;
      }

      return false;
    } else if (wizardType === 'edit-registration') {
      return this.isProfileIdNotNull(registrantProfileId);
    } else if (wizardType === 'new-ess-file') {
      return this.isProfileIdNotNull(registrantProfileId);
    } else if (wizardType === 'member-registration') {
      return this.isProfileCreationAllowed();
    } else if (wizardType === 'review-file') {
      return this.isFileReviewAllowed();
    } else if (wizardType === 'complete-file') {
      return this.isFileCompletionAllowed();
    } else {
      this.router.navigate(['/responder-access']);
    }
  }

  private isNewRegistrationAllowed(loggedInTask: string): boolean {
    return (
      loggedInTask !== null &&
      loggedInTask !== undefined &&
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
    //need to add more assumptions: houselhold members
    return (
      this.evacueeSessionService.essFileNumber !== null &&
      this.evacueeSessionService.essFileNumber !== undefined
    );
  }

  private isFileReviewAllowed(): boolean {
    return (
      this.evacueeSessionService.essFileNumber !== null &&
      this.evacueeSessionService.essFileNumber !== undefined
    ); // add file status for review
  }

  private isFileCompletionAllowed(): boolean {
    return (
      this.evacueeSessionService.essFileNumber !== null &&
      this.evacueeSessionService.essFileNumber !== undefined
    ); // add file status for complete
  }
}
