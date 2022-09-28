import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { EvacueeDetailsModel } from 'src/app/core/models/evacuee-search-context.model';
import { SearchFormRegistery } from 'src/app/core/services/helper/search-data.service';
import { padFileIdForSearch } from '../../../../core/services/helper/search.formatter';

@Component({
  selector: 'app-case-note-search',
  templateUrl: './case-note-search.component.html',
  styleUrls: ['./case-note-search.component.scss']
})
export class CaseNoteSearchComponent implements OnInit {
  fileSearchForm: FormGroup<{ essFileNumber: FormControl<string> }>;
  isLoading = false;
  isSubmitted = false;

  constructor(private optionInjectionService: OptionInjectionService) {}

  ngOnInit(): void {
    this.fileSearchForm = this.optionInjectionService?.instance?.createForm(
      SearchFormRegistery.caseNoteSearchForm
    );
  }

  search() {
    if (this.fileSearchForm.valid) {
      this.isLoading = !this.isLoading;
      this.isSubmitted = !this.isSubmitted;
      const searchParams: EvacueeDetailsModel = {
        essFileNumber: padFileIdForSearch(
          this.fileSearchForm.get('essFileNumber').value
        )
      };

      (
        this.optionInjectionService.instance.search(
          {
            evacueeSearchParameters: searchParams
          },
          padFileIdForSearch(this.fileSearchForm.get('essFileNumber').value)
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
