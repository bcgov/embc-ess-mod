import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { EvacueeSearchService } from '../evacuee-search.service';

@Component({
  selector: 'app-evacuee-id-verify',
  templateUrl: './evacuee-id-verify.component.html',
  styleUrls: ['./evacuee-id-verify.component.scss']
})
export class EvacueeIdVerifyComponent implements OnInit {
  @Output() showIDPhotoComponent = new EventEmitter<boolean>();

  idVerifyForm: FormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;

  tipsPanel1State = false;
  tipsPanel2State = false;

  constructor(
    private builder: FormBuilder,
    private evacueeSearchService: EvacueeSearchService
  ) {}

  /**
   * On component init, constructs the form
   */
  ngOnInit(): void {
    this.constructIdVerifyForm();
  }

  /**
   * Returns form control
   */
  get idVerifyFormControl(): { [key: string]: AbstractControl } {
    return this.idVerifyForm.controls;
  }

  /**
   * Builds the form
   */
  constructIdVerifyForm(): void {
    this.idVerifyForm = this.builder.group({
      photoId: [
        this.evacueeSearchContextModel?.hasShownIdentification,
        [Validators.required]
      ]
    });
  }

  /**
   * Saves the seach parameter into the model and Navigates to the evacuee-name-search component
   */
  next(): void {
    // this.evacueeSearchService.setHasShownIdentification(
    //   this.idVerifyForm.get('photoId').value
    // );
    const idVerify = {
      hasShownIdentification: this.idVerifyForm.get('photoId').value
    };
    this.evacueeSearchService.setEvacueeSearchContext(idVerify);
    this.showIDPhotoComponent.emit(false);
  }
}
