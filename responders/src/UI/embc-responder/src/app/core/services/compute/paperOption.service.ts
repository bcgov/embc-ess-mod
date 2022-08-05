import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    private router: Router,
    private dataService: DataService,
    private builder: FormBuilder
  ) {}

  loadEvcaueeProfile(): Promise<RegistrantProfileModel> {
    throw new Error('Method not implemented.');
  }

  loadEssFile(): Promise<EvacuationFileModel> {
    throw new Error('Method not implemented.');
  }

  getDashboardBanner(fileStatus: string): DashboardBanner {
    return this.dataService.getDashboardText(fileStatus);
  }

  createForm(formType: string): FormGroup {
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
    let route: string = '';
    switch (wizardType) {
      case WizardType.NewRegistration:
        await this.dataService
          .openPaperNewRegistration()
          .then((value) => (route = value));
      // case SearchFormRegistery.idVerifySearchForm:
      //   return ;
      // case SearchFormRegistery.nameSearchForm:
      //   return ;
      // case SearchFormRegistery.paperSearchForm:
      //   return ;
      default:
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
