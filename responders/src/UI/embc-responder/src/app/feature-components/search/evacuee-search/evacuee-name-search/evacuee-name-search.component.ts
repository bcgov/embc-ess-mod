import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';
import {
  EvacueeDetailsModel,
  EvacueeSearchContextModel
} from 'src/app/core/models/evacuee-search-context.model';
import {
  SearchFormRegistery,
  SearchPages
} from 'src/app/core/services/helper/search-data.service';

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
  nameSearchForm: UntypedFormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;
  readonly selectedPathType = SelectedPathType;

  constructor(public optionInjectionService: OptionInjectionService) {}

  /**
   * On component init, constructs the form
   */
  ngOnInit(): void {
    if (
      this.optionInjectionService?.instance?.optionType ===
      SelectedPathType.digital
    ) {
      this.nameSearchForm = this.optionInjectionService.instance.createForm(
        SearchFormRegistery.nameSearchForm
      );
    } else if (
      this.optionInjectionService?.instance?.optionType ===
      SelectedPathType.paperBased
    ) {
      this.nameSearchForm = this.optionInjectionService.instance.createForm(
        SearchFormRegistery.paperSearchForm
      );
    }
  }

  /**
   * Returns form control
   */
  get nameSearchFormControl(): { [key: string]: AbstractControl } {
    return this.nameSearchForm.controls;
  }

  /**
   * Saves the search params into the model and navigates to the search result component
   */
  search(): void {
    const searchParams: EvacueeDetailsModel = {
      firstName: this.nameSearchForm.get('firstName').value,
      lastName: this.nameSearchForm.get('lastName').value,
      dateOfBirth: this.nameSearchForm.get('dateOfBirth').value,
      paperFileNumber:
        this.optionInjectionService?.instance?.optionType ===
        SelectedPathType.paperBased
          ? 'T' + this.nameSearchForm.get('paperBasedEssFile').value
          : null
    };

    this.optionInjectionService.instance.search(
      {
        evacueeSearchParameters: searchParams
      },
      SearchPages.digitalNameSearch
    );
  }
}
