import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/core/services/cache.service';
import {
  EvacuationFileSearchResultModel,
  RegistrantProfileSearchResultModel
} from 'src/app/core/models/evacuee-search-results';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../../core/services/global-constants';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';

@Component({
  selector: 'app-evacuee-search-results',
  templateUrl: './evacuee-search-results.component.html',
  styleUrls: ['./evacuee-search-results.component.scss']
})
export class EvacueeSearchResultsComponent implements OnInit {
  @Output() showIDPhotoComponent = new EventEmitter<boolean>();
  registrantResults: Array<RegistrantProfileSearchResultModel>;
  fileResults: Array<EvacuationFileSearchResultModel>;
  evacueeSearchContext: EvacueeSearchContextModel;
  isLoading = false;
  color = '#169BD5';

  constructor(
    private evacueeSearchResultsService: EvacueeSearchResultsService,
    private evacueeSearchService: EvacueeSearchService,
    private evacueeSessionService: EvacueeSessionService,
    private userService: UserService,
    private router: Router,
    private cacheService: CacheService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.searchForEvacuee(
      (this.evacueeSearchContext = this.evacueeSearchService.evacueeSearchContext)
    );
  }

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(
      ClaimType.action,
      ActionPermission[action]
    );
  }

  /**
   * Resets the search
   */
  searchAgain(): void {
    this.showIDPhotoComponent.emit(true);
  }

  /**
   * Searches for profiles and ess file based on the
   * search parameters
   *
   * @param evacueeSearchContext search parameters
   */
  searchForEvacuee(evacueeSearchContext: EvacueeSearchContextModel): void {
    this.isLoading = !this.isLoading;
    this.evacueeSearchResultsService
      .searchForEvacuee(evacueeSearchContext.evacueeSearchParameters)
      .subscribe(
        (results) => {
          this.isLoading = !this.isLoading;
          this.fileResults = results.files;
          this.registrantResults = results.registrants.sort(
            (a, b) =>
              new Date(b.modifiedOn).valueOf() -
              new Date(a.modifiedOn).valueOf()
          );
          console.log(this.registrantResults)
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.setAlert('danger', globalConst.evacueeSearchError);
        }
      );
  }

  openWizard(): void {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee'
    );
    this.evacueeSessionService.setWizardType('new-registration');

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: 'new-registration' },
      queryParamsHandling: 'merge'
    });
  }
}
