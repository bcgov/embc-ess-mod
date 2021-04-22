import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvacueeDetailsModel, EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { EvacueeSearchService } from '../evacuee-search.service';

@Component({
  selector: 'app-evacuee-name-search',
  templateUrl: './evacuee-name-search.component.html',
  styleUrls: ['./evacuee-name-search.component.scss']
})
export class EvacueeNameSearchComponent implements OnInit {

  @Output() showResultsComponent = new EventEmitter<boolean>();

  panel1OpenState = false;
  panel2OpenState = false;
  readonly dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  nameSearchForm: FormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;

  constructor(private customValidation: CustomValidationService, private builder: FormBuilder, private evacueeSearchService: EvacueeSearchService) { }

  ngOnInit(): void {
    this.constructNameForm();
  }

  get nameSearchFormControl(): { [key: string]: AbstractControl; } {
    return this.nameSearchForm.controls;
  }

  constructNameForm(): void {
    this.nameSearchForm = this.builder.group({
      firstName: [this.evacueeSearchContextModel?.evacueeSearchParameters.firstName, [Validators.required, this.customValidation.whitespaceValidator()]],
      lastName: [this.evacueeSearchContextModel?.evacueeSearchParameters.lastName, [Validators.required, this.customValidation.whitespaceValidator()]],
      dateOfBirth: [this.evacueeSearchContextModel?.evacueeSearchParameters.dateOfBirth, [Validators.required, this.customValidation.dateOfBirthValidator()]],
    });
  }

  search() {
    if(this.nameSearchForm.status == 'VALID') {
      
      let searchParams: EvacueeDetailsModel = {
        firstName: this.nameSearchForm.get('firstName').value,
        lastName: this.nameSearchForm.get('lastName').value,
        dateOfBirth: this.nameSearchForm.get('dateOfBirth').value,
      }
  
      this.evacueeSearchService.evacueeSearchParameters = searchParams;
      this.showResultsComponent.emit(true);

    } else {
      this.nameSearchForm.markAllAsTouched();
    }
  }
}
