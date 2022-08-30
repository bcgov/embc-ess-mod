import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { SearchDataService, SearchPages } from '../helper/search-data.service';
import * as globalConst from '../global-constants';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { DataService } from '../helper/data.service';
import { EvacuationFileModel } from '../../models/evacuation-file.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { EvacueeSearchResults } from '../../models/evacuee-search-results';
import { WizardType } from '../../models/wizard-type.model';

@Injectable()
export class DigitalOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.digital;
  idSearchQuestion: string = globalConst.digitalIdQuestion;

  constructor(
    private router: Router,
    private dataService: DataService,
    private builder: UntypedFormBuilder
  ) {}

  loadEvcaueeProfile(registrantId: string): Promise<RegistrantProfileModel> {
    return this.dataService.getEvacueeProfile(registrantId);
  }

  loadEssFile(): Promise<EvacuationFileModel> {
    return this.dataService.getEssFile();
  }

  getDashboardBanner(fileStatus: string): DashboardBanner {
    return this.dataService.getDashboardText(fileStatus);
  }

  createForm(formType: string): UntypedFormGroup {
    return this.builder.group(this.dataService.fetchForm(formType));
  }

  loadDefaultComponent(): void {
    this.router.navigate(['/responder-access/search/evacuee/id-search'], {
      skipLocationChange: true
    });
  }

  search(
    value: string | EvacueeSearchContextModel,
    type?: string
  ): void | Promise<EvacueeSearchResults> {
    this.dataService.saveSearchParams(value);
    if (type === SearchPages.idVerifySearch) {
      this.router.navigate(['/responder-access/search/evacuee/name-search'], {
        skipLocationChange: true
      });
    } else if (type === SearchPages.digitalNameSearch) {
      this.router.navigate(
        ['/responder-access/search/evacuee/search-results'],
        {
          skipLocationChange: true
        }
      );
    } else if (type === SearchPages.searchResults) {
      return this.dataService.evacueeSearch(
        (value as EvacueeSearchContextModel).evacueeSearchParameters
      );
    }
  }

  openWizard(wizardType: string): Promise<boolean> {
    switch (wizardType) {
      case WizardType.NewRegistration:
        this.dataService.updateNewRegistrationWizard();
        break;
      case WizardType.NewEssFile:
        this.dataService.updateNewEssFile();
        break;
      case WizardType.EditRegistration:
        this.dataService.updateEditRegistrationWizard();
        break;
      case WizardType.ReviewFile:
        this.dataService.updateReviewEssFile();
        break;
      case WizardType.CompleteFile:
        this.dataService.updateCompleteEssFile();
        break;
      default:
        break;
    }

    return this.router.navigate(['/ess-wizard'], {
      queryParams: { type: wizardType },
      queryParamsHandling: 'merge'
    });
  }
}
