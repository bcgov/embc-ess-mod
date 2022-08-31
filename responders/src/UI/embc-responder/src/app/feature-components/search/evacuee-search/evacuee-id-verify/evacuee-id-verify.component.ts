import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import {
  SearchFormRegistery,
  SearchPages
} from 'src/app/core/services/helper/search-data.service';

@Component({
  selector: 'app-evacuee-id-verify',
  templateUrl: './evacuee-id-verify.component.html',
  styleUrls: ['./evacuee-id-verify.component.scss']
})
export class EvacueeIdVerifyComponent implements OnInit {
  @Output() showIDPhotoComponent = new EventEmitter<boolean>();

  idVerifyForm: UntypedFormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;

  tipsPanel1State = false;
  tipsPanel2State = false;
  idQuestion: string;

  constructor(private optionInjectionService: OptionInjectionService) {}

  /**
   * On component init, constructs the form
   */
  ngOnInit(): void {
    this.idVerifyForm = this.optionInjectionService?.instance?.createForm(
      SearchFormRegistery.idVerifySearchForm
    );
    this.idQuestion = this.optionInjectionService?.instance?.idSearchQuestion;
  }

  /**
   * Returns form control
   */
  get idVerifyFormControl(): { [key: string]: AbstractControl } {
    return this.idVerifyForm.controls;
  }

  /**
   * Saves the seach parameter into the model and Navigates to the evacuee-name-search component
   */
  next(): void {
    const idVerify = {
      hasShownIdentification: this.idVerifyForm.get('photoId').value
    };
    this.optionInjectionService?.instance?.search(
      idVerify,
      SearchPages.idVerifySearch
    );
  }
}
