import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchOptionsService } from '../../interfaces/searchOptions.service';
import { SelectedPathType } from '../../models/appBase.model';
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

  search(id: string): void {
    this.searchDataService.searchForEssFiles(id).subscribe({
      next: (result) => {
        if (result.length !== 0) {
          this.searchDataService.setSelectedFile(result[0].id);
          this.router.navigate(['responder-access/search/essfile-dashboard']);
        } else {
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
