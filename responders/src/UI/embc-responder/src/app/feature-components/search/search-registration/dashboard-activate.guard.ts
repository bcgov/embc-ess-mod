import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardActivateGuard implements CanActivate {
  constructor(
    private evacueeSearchService: EvacueeSearchService,
    private appBaseService: AppBaseService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const registrantProfileId =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.id;
    const selectedFileId = this.appBaseService?.appModel?.selectedEssFile?.id;
    if (this.canActivateRoute(registrantProfileId, selectedFileId)) {
      return true;
    }
    return this.router.navigate(['/responder-access/search/evacuee']);
  }

  private canActivateRoute(
    registrantProfileId: string,
    selectedFileId: string
  ): boolean {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
        SelectedPathType.remoteExtensions ||
      this.appBaseService?.appModel?.selectedUserPathway ===
        SelectedPathType.caseNotes
    ) {
      return (
        selectedFileId !== null &&
        selectedFileId !== undefined &&
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
