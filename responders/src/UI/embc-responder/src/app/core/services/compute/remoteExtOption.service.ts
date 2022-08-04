import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { EvacuationFileModel } from '../../models/evacuation-file.model';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { DataService } from '../helper/data.service';

@Injectable()
export class RemoteExtOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.remoteExtensions;
  idSearchQuestion = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private builder: FormBuilder
  ) {}

  loadEvcaueeProfile(registrantId: string): Promise<RegistrantProfileModel> {
    return this.dataService.getEvacueeProfile(registrantId);
  }

  getDashboardBanner(fileStatus: string): DashboardBanner {
    return this.dataService.getDashboardText(fileStatus);
  }

  createForm(formType: string): FormGroup {
    return this.builder.group(this.dataService.fetchForm(formType));
  }

  loadDefaultComponent(): void {
    this.router.navigate(['/responder-access/search/evacuee/remote-search'], {
      skipLocationChange: true
    });
  }

  search(
    value: string | EvacueeSearchContextModel,
    id: string
  ): Promise<boolean> {
    this.dataService.saveSearchParams(value);

    return this.dataService
      .searchForEssFiles(id)
      .then((fileResult) => this.navigate(fileResult, value));
  }

  loadEssFile(): Promise<EvacuationFileModel> {
    return this.dataService.getEssFile();
  }

  private navigate(fileResult, value) {
    if (fileResult.length !== 0) {
      this.dataService.setSelectedFile(fileResult[0].id);
      return this.router.navigate([
        'responder-access/search/essfile-dashboard'
      ]);
    } else {
      this.dataService.setSelectedFile(
        (value as EvacueeSearchContextModel).evacueeSearchParameters
          ?.essFileNumber
      );
      return this.router.navigate(
        ['/responder-access/search/evacuee/search-results'],
        {
          skipLocationChange: true
        }
      );
    }
  }
}
