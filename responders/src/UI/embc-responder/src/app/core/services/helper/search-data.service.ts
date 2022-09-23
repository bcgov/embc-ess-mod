import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ComputeRulesService } from '../computeRules.service';
import { CustomValidationService } from '../customValidation.service';
import { EvacueeProfileService } from '../evacuee-profile.service';
import { AppBaseService } from './appBase.service';
import * as globalConst from '../global-constants';
import { EvacuationFileSummaryModel } from '../../models/evacuation-file-summary.model';
import { lastValueFrom, tap } from 'rxjs';
import { Validators } from '@angular/forms';
import { EvacueeSearchService } from 'src/app/feature-components/search/evacuee-search/evacuee-search.service';
import { DashboardService } from './dashboard.service';
import { EssFileService } from '../ess-file.service';
import { EvacueeDetailsModel } from '../../models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../../models/evacuee-search-results';
import { WizardType } from '../../models/wizard-type.model';
import { SelectedPathType } from '../../models/appBase.model';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService extends DashboardService {
  fileSearchForm = {
    essFileNumber: ['', [this.customValidation.whitespaceValidator()]]
  };

  idVerifyForm = {
    photoId: ['', [Validators.required]]
  };

  nameSearchForm = {
    firstName: [
      '',
      [Validators.required, this.customValidation.whitespaceValidator()]
    ],
    lastName: [
      '',
      [Validators.required, this.customValidation.whitespaceValidator()]
    ],
    dateOfBirth: [
      '',
      [Validators.required, this.customValidation.dateOfBirthValidator()]
    ]
  };

  paperNameSearchForm = {
    firstName: [
      '',
      [Validators.required, this.customValidation.whitespaceValidator()]
    ],
    lastName: [
      '',
      [Validators.required, this.customValidation.whitespaceValidator()]
    ],
    dateOfBirth: [
      '',
      [Validators.required, this.customValidation.dateOfBirthValidator()]
    ],
    paperBasedEssFile: ['', this.customValidation.whitespaceValidator()]
  };

  constructor(
    private customValidation: CustomValidationService,
    appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    evacueeProfileService: EvacueeProfileService,
    alertService: AlertService,
    essFileService: EssFileService,
    protected evacueeSearchService: EvacueeSearchService //TODO: Remove this service
  ) {
    super(appBaseService, essFileService, alertService, evacueeProfileService);
  }

  public saveSearchParams(value: unknown) {
    this.evacueeSearchService.evacueeSearchContext = value;
  }

  public fetchForm(type: string) {
    switch (type) {
      case SearchFormRegistery.remoteSearchForm:
        return this.fileSearchForm;
      case SearchFormRegistery.idVerifySearchForm:
        return this.idVerifyForm;
      case SearchFormRegistery.nameSearchForm:
        return this.nameSearchForm;
      case SearchFormRegistery.paperSearchForm:
        return this.paperNameSearchForm;
      case SearchFormRegistery.caseNoteSearchForm:
        return this.fileSearchForm;
      default:
        return;
    }
  }

  updateNewRegistrationWizard(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.NewRegistration,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  updateEditRegistrationWizard(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.EditRegistration,
      lastCompletedStep: null,
      editFlag:
        !this.appBaseService?.appModel?.selectedProfile
          ?.selectedEvacueeInContext?.authenticatedUser &&
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
          ?.verifiedUser,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  updateNewEssFile(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.NewEssFile,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.appBaseService.appModel = { selectedEssFile: null };
    this.computeState.triggerEvent();
  }

  updateReviewEssFile(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.ReviewFile,
      lastCompletedStep: null,
      editFlag: true,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  updateCompleteEssFile(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.CompleteFile,
      lastCompletedStep: null,
      editFlag: true,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  updateExtendSupports(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.ExtendSupports,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  updateCaseNotes(): void {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.CaseNotes,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }

  async checkForPaperFile(wizardType: string): Promise<string> {
    const paperFileNumber =
      this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters
        ?.paperFileNumber;
    return await this.searchForEssFiles(
      undefined,
      paperFileNumber,
      undefined
    ).then((result) => {
      if (result.length === 0) {
        switch (wizardType) {
          case WizardType.NewRegistration:
            this.updateNewRegistrationWizard();
            break;
          case WizardType.NewEssFile:
            this.updateNewEssFile();
            break;
        }
        return '/ess-wizard';
      }
      return null;
    });
  }

  public searchForEssFiles(
    registrantId?: string,
    manualFileId?: string,
    id?: string
  ): Promise<Array<EvacuationFileSummaryModel>> {
    const file$ = this.evacueeProfileService
      .getProfileFiles(registrantId, manualFileId, id)
      .pipe(
        tap({
          next: (result) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.findEssFileError);
          }
        })
      );
    return lastValueFrom(file$);
  }

  public evacueeSearch(
    evacueeSearchContext: EvacueeDetailsModel
  ): Promise<EvacueeSearchResults> {
    const $results = this.evacueeProfileService
      .searchForEvacuee(evacueeSearchContext)
      .pipe(
        tap({
          next: (result) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.evacueeSearchError
            );
          }
        })
      );
    return lastValueFrom($results);
  }

  public setSelectedFile(fileId: string) {
    this.appBaseService.appModel = {
      selectedEssFile: {
        id: fileId,
        evacuatedFromAddress: null,
        needsAssessment: null,
        primaryRegistrantId: null,
        registrationLocation: null,
        task: null
      }
    };

    this.computeState.triggerEvent();
  }
}

export enum SearchFormRegistery {
  remoteSearchForm = 'remoteSearchForm',
  idVerifySearchForm = 'idVerifySearchForm',
  nameSearchForm = 'nameSearchForm',
  paperSearchForm = 'paperSearchForm',
  caseNoteSearchForm = 'caseNoteSearchForm'
}

export enum SearchPages {
  essFileSearch = 'essFileSearch',
  idVerifySearch = 'idVerifySearch',
  digitalNameSearch = 'digitalNameSearch',
  searchResults = 'searchResults'
}
