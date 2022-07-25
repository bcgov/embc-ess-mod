import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
import { EvacuationFileSummaryModel } from '../../models/evacuation-file-summary.model';
import { EvacueeSearchContextModel } from '../../models/evacuee-search-context.model';
import { SearchDataService } from '../helper/search-data.service';

@Injectable()
export class RemoteExtOptionService implements SearchOptionsService {
  optionType: SelectedPathType = SelectedPathType.remoteExtensions;
  idSearchQuestion = '';

  constructor(
    private router: Router,
    private searchDataService: SearchDataService,
    private builder: FormBuilder
  ) {}

  createForm(formType: string): FormGroup {
    return this.builder.group(this.searchDataService.fetchForm(formType));
  }

  loadDefaultComponent(): void {
    this.router.navigate(['/responder-access/search/evacuee/remote-search'], {
      skipLocationChange: true
    });
  }

  search(value: string | EvacueeSearchContextModel, id: string): void {
    this.searchDataService.saveSearchParams(value);
    let fileResult: EvacuationFileSummaryModel[] = [];
    this.searchDataService.searchForEssFiles(id).subscribe({
      next: (result) => {
        fileResult = result;
      },
      complete: () => {
        if (fileResult.length !== 0) {
          this.searchDataService.setSelectedFile(fileResult[0].id);
          this.router.navigate(['responder-access/search/essfile-dashboard']);
        } else {
          this.searchDataService.setSelectedFile(
            (value as EvacueeSearchContextModel).evacueeSearchParameters
              ?.essFileNumber
          );
          this.router.navigate(
            ['/responder-access/search/evacuee/search-results'],
            {
              skipLocationChange: true
            }
          );
        }
      }
    });
  }
}
