import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ComputeRulesService } from '../computeRules.service';
import { CustomValidationService } from '../customValidation.service';
import { EvacueeProfileService } from '../evacuee-profile.service';
import { AppBaseService } from './appBase.service';
import * as globalConst from '../global-constants';
import { EvacuationFileSummaryModel } from '../../models/evacuation-file-summary.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { EvacueeSearchService } from 'src/app/feature-components/search/evacuee-search/evacuee-search.service';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  essFileResult: BehaviorSubject<Array<EvacuationFileSummaryModel>>;

  remoteSearchForm = {
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
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private evacueeSearchService: EvacueeSearchService //TODO: Remove this service
  ) {}

  /**
   * 
   * this.customValidation
          .conditionalValidation(
            () => this.paperBased === true,
            this.customValidation.whitespaceValidator()
          )
          .bind(this.customValidation)
   */

  public saveSearchParams(value: unknown) {
    this.evacueeSearchService.evacueeSearchContext = value;
  }

  public fetchForm(type: string) {
    switch (type) {
      case SearchFormRegistery.remoteSearchForm:
        return this.remoteSearchForm;
      case SearchFormRegistery.idVerifySearchForm:
        return this.idVerifyForm;
      case SearchFormRegistery.nameSearchForm:
        return this.nameSearchForm;
      case SearchFormRegistery.paperSearchForm:
        return this.paperNameSearchForm;
      default:
        return;
    }
  }

  public searchForEssFiles(
    id: string
  ): Observable<Array<EvacuationFileSummaryModel>> {
    this.essFileResult = new BehaviorSubject<Array<EvacuationFileSummaryModel>>(
      []
    );
    this.evacueeProfileService
      .getProfileFiles(undefined, undefined, id)
      .subscribe({
        next: (result) => {
          this.essFileResult.next(result);
          this.essFileResult.complete();
        },
        error: (errorResponse) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.findEssFileError);
        }
      });
    return this.essFileResult;
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
  paperSearchForm = 'paperSearchForm'
}

export enum SearchPages {
  essFileSearch = 'essFileSearch',
  idVerifySearch = 'idVerifySearch',
  digitalNameSearch = 'digitalNameSearch',
  searchResults = 'searchResults'
}
