import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { EvacueeDetailsModel } from 'src/app/core/models/evacuee-search-context.model';
import { SearchFormRegistery } from 'src/app/core/services/helper/search-data.service';

@Component({
  selector: 'app-remote-search',
  templateUrl: './remote-search.component.html',
  styleUrls: ['./remote-search.component.scss']
})
export class RemoteSearchComponent implements OnInit {
  fileSearchForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(private optionInjectionService: OptionInjectionService) {}

  ngOnInit(): void {
    this.fileSearchForm = this.optionInjectionService.instance.createForm(
      SearchFormRegistery.remoteSearchForm
    );
  }

  get fileSearchFormControl(): { [key: string]: AbstractControl } {
    return this.fileSearchForm.controls;
  }

  search() {
    if (this.fileSearchForm.valid) {
      this.isLoading = !this.isLoading;
      this.isSubmitted = !this.isSubmitted;
      const searchParams: EvacueeDetailsModel = {
        essFileNumber: this.fileSearchForm.get('essFileNumber').value
      };

      (
        this.optionInjectionService.instance.search(
          {
            evacueeSearchParameters: searchParams
          },
          this.fileSearchForm.get('essFileNumber').value
        ) as Promise<boolean>
      )
        .then(() => {
          this.isLoading = !this.isLoading;
          this.isSubmitted = !this.isSubmitted;
        })
        .catch(() => {
          this.isLoading = !this.isLoading;
          this.isSubmitted = !this.isSubmitted;
        });
    } else {
      this.fileSearchForm.get('essFileNumber').markAsTouched();
    }
  }
}
