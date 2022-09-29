import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardActivateGuard implements CanActivate {
  constructor(
    private evacueeSearchService: EvacueeSearchService,
    private appBaseService: AppBaseService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const registrantProfileId =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.id;
    if (this.canActivateRoute(registrantProfileId)) {
      return true;
    }
    return false;
  }

  private canActivateRoute(registrantProfileId: string): boolean {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
        SelectedPathType.remoteExtensions ||
      this.appBaseService?.appModel?.selectedUserPathway ===
        SelectedPathType.caseNotes
    ) {
      return (
        this.evacueeSearchService?.evacueeSearchContext
          ?.evacueeSearchParameters !== null &&
        this.evacueeSearchService?.evacueeSearchContext
          ?.evacueeSearchParameters !== undefined
      );
    } else {
      return (
        registrantProfileId !== null &&
        registrantProfileId !== undefined &&
        this.evacueeSearchService?.evacueeSearchContext
          ?.evacueeSearchParameters !== null &&
        this.evacueeSearchService?.evacueeSearchContext
          ?.evacueeSearchParameters !== undefined
      );
    }
  }
}
