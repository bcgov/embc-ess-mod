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

@Injectable()
export class PaperOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.paperBased;
  idSearchQuestion: string = globalConst.paperIdQuestion;

  constructor(
    private router: Router,
    private dataService: DataService,
    private builder: FormBuilder
  ) {}

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

  search(value: string | EvacueeSearchContextModel, type?: string): void {
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
      // TODO
    }
  }
}
