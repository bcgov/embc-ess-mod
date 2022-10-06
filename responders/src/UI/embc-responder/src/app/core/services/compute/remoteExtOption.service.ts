import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EvacuationFileStatus } from '../../api/models';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { EvacuationFileSummaryModel } from '../../models/evacuation-file-summary.model';
import { EvacuationFileModel } from '../../models/evacuation-file.model';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { WizardType } from '../../models/wizard-type.model';
import { DataService } from '../helper/data.service';

@Injectable()
export class RemoteExtOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.remoteExtensions;
  idSearchQuestion = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private builder: UntypedFormBuilder
  ) {}

  loadEvcaueeProfile(registrantId: string): Promise<RegistrantProfileModel> {
    return this.dataService.getEvacueeProfile(registrantId);
  }

  getDashboardBanner(fileStatus: string): DashboardBanner {
    return this.dataService.getDashboardText(fileStatus);
  }

  createForm(formType: string): UntypedFormGroup {
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
      .searchForEssFiles(undefined, undefined, id)
      .then((fileResult) => this.navigate(fileResult, value));
  }

  loadEssFile(): Promise<EvacuationFileModel> {
    return this.dataService.getEssFile();
  }

  openWizard(wizardType: string): Promise<boolean> {
    switch (wizardType) {
      case WizardType.ExtendSupports:
        this.dataService.updateExtendSupports();
        break;
      default:
        break;
    }

    return this.router.navigate(['/ess-wizard'], {
      queryParams: { type: wizardType },
      queryParamsHandling: 'merge'
    });
  }

  private navigate(fileResult: EvacuationFileSummaryModel[], value) {
    if (this.allowDashboardNavigation(fileResult)) {
      this.dataService.setSelectedFile(fileResult[0].id);
      return this.router.navigate([
        'responder-access/search/essfile-dashboard'
      ]);
    } else {
      return this.router.navigate(
        ['/responder-access/search/evacuee/search-results'],
        {
          skipLocationChange: true
        }
      );
    }
  }

  private allowDashboardNavigation(
    fileSummary: EvacuationFileSummaryModel[]
  ): boolean {
    if (
      fileSummary.length !== 0 &&
      fileSummary[0].status === EvacuationFileStatus.Active &&
      fileSummary[0].hasSupports
    ) {
      return true;
    }
    return false;
  }
}
