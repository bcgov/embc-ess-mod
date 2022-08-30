import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { SearchPages } from '../helper/search-data.service';
import * as globalConst from '../global-constants';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { DataService } from '../helper/data.service';
import { EvacuationFileModel } from '../../models/evacuation-file.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { EvacueeSearchResults } from '../../models/evacuee-search-results';
import { WizardType } from '../../models/wizard-type.model';

@Injectable()
export class PaperOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.paperBased;
  idSearchQuestion: string = globalConst.paperIdQuestion;

  constructor(
    protected router: Router,
    protected dataService: DataService,
    protected builder: UntypedFormBuilder
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

  async openWizard(wizardType: string): Promise<boolean> {
    let route = '';
    switch (wizardType) {
      case WizardType.NewRegistration:
        await this.dataService
          .checkForPaperFile(wizardType)
          .then((value) => (route = value));
        break;
      case WizardType.NewEssFile:
        await this.dataService
          .checkForPaperFile(wizardType)
          .then((value) => (route = value));
        break;
      case WizardType.EditRegistration:
        this.dataService.updateEditRegistrationWizard();
        route = '/ess-wizard';
        break;
      case WizardType.ReviewFile:
        this.dataService.updateReviewEssFile();
        route = '/ess-wizard';
        break;
      case WizardType.CompleteFile:
        this.dataService.updateCompleteEssFile();
        route = '/ess-wizard';
        break;
      default:
        break;
    }
    return new Promise<boolean>((resolve, reject) => {
      if (route !== null) {
        return this.router.navigate([route], {
          queryParams: { type: wizardType },
          queryParamsHandling: 'merge'
        });
      }
      resolve(false);
    });
  }
}
