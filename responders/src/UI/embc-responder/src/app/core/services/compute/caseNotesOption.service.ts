import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EvacuationFileStatus, MemberRole } from '../../api/models';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { DashboardBanner } from '../../models/dialog-content.model';
import { EvacuationFileSummaryModel } from '../../models/evacuation-file-summary.model';
import { EvacuationFileModel } from '../../models/evacuation-file.model';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { RegistrantProfileModel } from '../../models/registrant-profile.model';
import { WizardType } from '../../models/wizard-type.model';
import { DataService } from '../helper/data.service';
import { UserService } from '../user.service';

@Injectable()
export class CaseNotesOptionService implements SearchOptionsService {
  idSearchQuestion: string;
  optionType: SelectedPathType = SelectedPathType.caseNotes;

  constructor(
    private router: Router,
    private dataService: DataService,
    private builder: UntypedFormBuilder,
    private userService: UserService
  ) {}

  loadDefaultComponent(): void {
    this.router.navigate(
      ['/responder-access/search/evacuee/caseNotes-search'],
      {
        skipLocationChange: true
      }
    );
  }
  createForm(formType: string): UntypedFormGroup {
    return this.builder.group(this.dataService.fetchForm(formType));
  }
  search(
    value: string | EvacueeSearchContextModel,
    id: string
  ): void | Promise<boolean> {
    this.dataService.saveSearchParams(value);

    return this.dataService
      .searchForEssFiles(undefined, undefined, id)
      .then((fileResult) => this.navigate(fileResult, value));
  }
  getDashboardBanner(fileStatus: string): DashboardBanner {
    return this.dataService.getDashboardText(fileStatus);
  }
  loadEssFile(): Promise<EvacuationFileModel> {
    return this.dataService.getEssFile();
  }
  loadEvcaueeProfile(registrantId: string): Promise<RegistrantProfileModel> {
    return this.dataService.getEvacueeProfile(registrantId);
  }
  openWizard(wizardType: string): Promise<boolean> {
    switch (wizardType) {
      case WizardType.CaseNotes:
        this.dataService.updateCaseNotes();
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
      this.userService.currentProfile.role === MemberRole.Tier1 &&
      fileSummary[0].status === EvacuationFileStatus.Active &&
      !fileSummary[0].isRestricted
    ) {
      return true;
    } else if (
      fileSummary.length !== 0 &&
      this.userService.currentProfile.role !== MemberRole.Tier1 &&
      (fileSummary[0].status === EvacuationFileStatus.Active ||
        fileSummary[0].status === EvacuationFileStatus.Completed)
    ) {
      return true;
    }
    return false;
  }
}
