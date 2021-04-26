import { Component, OnInit } from '@angular/core';
import { EvacuationFileSearchResult, RegistrantProfileSearchResult } from 'src/app/core/api/models';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { UserService } from 'src/app/core/services/user.service';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';
import { ActionPermission, ClaimType } from 'src/app/core/services/authorization.service';

@Component({
  selector: 'app-evacuee-search-results',
  templateUrl: './evacuee-search-results.component.html',
  styleUrls: ['./evacuee-search-results.component.scss']
})
export class EvacueeSearchResultsComponent implements OnInit {

  registrantResults: Array<RegistrantProfileSearchResult>;
  fileResults: Array<EvacuationFileSearchResult>;
  evacueeSearchContext: EvacueeSearchContextModel;
  isLoading = false;
  color = '#169BD5';

  constructor(private evacueeSearchResultsService: EvacueeSearchResultsService, private evacueeSearchService: EvacueeSearchService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.searchForEvacuee(this.evacueeSearchContext = this.evacueeSearchService.getEvacueeSearchContext());
  }

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(ClaimType.action, ActionPermission[action]);
  }

  searchAgain(): void {
    console.log('here');
  }

  searchForEvacuee(evacueeSearchContext: EvacueeSearchContextModel): void {
    this.evacueeSearchResultsService.searchForEvacuee(evacueeSearchContext.evacueeSearchParameters).subscribe((results) => {
      this.isLoading = !this.isLoading;
      this.fileResults = results.files;
      this.registrantResults = results.registrants;
      // .sort((a, b) => new Date(b.createdOn).valueOf() - new Date(a.createdOn).valueOf())
    }, (error) => {
      console.log(error);
    });
  }

}
