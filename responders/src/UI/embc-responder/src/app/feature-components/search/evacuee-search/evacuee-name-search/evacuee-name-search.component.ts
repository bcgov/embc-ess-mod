import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  EvacueeDetailsModel,
  EvacueeSearchContextModel
} from 'src/app/core/models/evacuee-search-context.model';
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
  readonly dateMask = [
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  nameSearchForm: FormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;

  constructor(
    private customValidation: CustomValidationService,
    private builder: FormBuilder,
    private evacueeSearchService: EvacueeSearchService,
    private router: Router
  ) {}

  /**
   * On component init, constructs the form
   */
  ngOnInit(): void {
    this.constructNameForm();
  }

  /**
   * Returns form control
   */
  get nameSearchFormControl(): { [key: string]: AbstractControl } {
    return this.nameSearchForm.controls;
  }

  /**
   * Builds the form
   */
  constructNameForm(): void {
    this.nameSearchForm = this.builder.group({
      firstName: [
        this.evacueeSearchContextModel?.evacueeSearchParameters.firstName,
        [Validators.required, this.customValidation.whitespaceValidator()]
      ],
      lastName: [
        this.evacueeSearchContextModel?.evacueeSearchParameters.lastName,
        [Validators.required, this.customValidation.whitespaceValidator()]
      ],
      dateOfBirth: [
        this.evacueeSearchContextModel?.evacueeSearchParameters.dateOfBirth,
        [Validators.required, this.customValidation.dateOfBirthValidator()]
      ]
    });
  }

  /**
   * Saves the search params into the model and navigates to the search result component
   */
  search(): void {
    const searchParams: EvacueeDetailsModel = {
      firstName: this.nameSearchForm.get('firstName').value,
      lastName: this.nameSearchForm.get('lastName').value,
      dateOfBirth: this.nameSearchForm.get('dateOfBirth').value
    };

    this.evacueeSearchService.setEvacueeSearchContext({
      evacueeSearchParameters: searchParams
    });
    this.showResultsComponent.emit(true);
    this.router.navigate(['/responder-access/search/evacuee']);
  }
}
