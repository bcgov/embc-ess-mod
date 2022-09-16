import { Component, OnInit } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { Router } from '@angular/router';
import {
  EvacuationFileSearchResultModel,
  EvacueeSearchResults,
  RegistrantProfileSearchResultModel
} from 'src/app/core/models/evacuee-search-results';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import { SearchPages } from 'src/app/core/services/helper/search-data.service';

@Component({
  selector: 'app-evacuee-search-results',
  templateUrl: './evacuee-search-results.component.html',
  styleUrls: ['./evacuee-search-results.component.scss']
})
export class EvacueeSearchResultsComponent implements OnInit {
  registrantResults: Array<RegistrantProfileSearchResultModel>;
  fileResults: Array<EvacuationFileSearchResultModel>;
  evacueeSearchContext: EvacueeSearchContextModel;
  color = '#169BD5';
  readonly selectedPathType = SelectedPathType;

  constructor(
    public evacueeSearchResultsService: EvacueeSearchResultsService,
    public evacueeSearchService: EvacueeSearchService,
    private userService: UserService,
    private router: Router,
    public optionInjectionService: OptionInjectionService
  ) {}

  ngOnInit(): void {
    if (
      this.optionInjectionService?.instance?.optionType !==
        SelectedPathType.remoteExtensions &&
      this.optionInjectionService?.instance?.optionType !==
        SelectedPathType.caseNotes
    ) {
      this.searchForEvacuee(
        (this.evacueeSearchContext =
          this.evacueeSearchService.evacueeSearchContext)
      );
    }
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
    this.router.navigate(['/responder-access/search/evacuee'], {
      replaceUrl: true
    });
  }

  /**
   * Searches for profiles and ess file based on the
   * search parameters
   *
   * @param evacueeSearchContext search parameters
   */
  searchForEvacuee(evacueeSearchContext: EvacueeSearchContextModel): void {
    this.evacueeSearchResultsService.setloadingOverlay(true);
    (
      this.optionInjectionService?.instance?.search(
        evacueeSearchContext,
        SearchPages.searchResults
      ) as Promise<EvacueeSearchResults>
    )
      ?.then((results: EvacueeSearchResults) => {
        this.evacueeSearchResultsService.setloadingOverlay(false);
        this.fileResults = results?.files;
        this.registrantResults = results?.registrants;
      })
      .catch(() => {
        this.evacueeSearchResultsService.setloadingOverlay(false);
      });
  }

  openWizard(): void {
    this.optionInjectionService?.instance
      ?.openWizard(WizardType.NewRegistration)
      ?.then((value) => {
        if (!value) {
          this.evacueeSearchResultsService.openEssFileExistsDialog(
            this.evacueeSearchService?.evacueeSearchContext
              ?.evacueeSearchParameters?.paperFileNumber
          );
        }
      });
  }
}
