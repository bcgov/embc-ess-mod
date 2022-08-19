import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvacuationFileSearchResultModel } from '../core/models/evacuee-search-results';
import { ComputeRulesService } from '../core/services/computeRules.service';
import { EvacueeProfileService } from '../core/services/evacuee-profile.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { EssFilesResultsService } from '../feature-components/search/evacuee-search/ess-files-results/ess-files-results.service';
import { AlertService } from '../shared/components/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssFilesResultsService extends EssFilesResultsService {
  constructor(
    appBaseService: AppBaseService,
    computeState: ComputeRulesService,
    evacueeProfileService: EvacueeProfileService,
    alertService: AlertService,
    dialog: MatDialog
  ) {
    super(
      appBaseService,
      computeState,
      evacueeProfileService,
      alertService,
      dialog
    );
  }

  public async getSearchedUserProfile(
    selectedFile: EvacuationFileSearchResultModel
  ) {
    return null;
  }
}
