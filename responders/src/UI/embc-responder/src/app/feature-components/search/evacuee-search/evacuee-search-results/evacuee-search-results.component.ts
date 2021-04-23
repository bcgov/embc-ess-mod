import { Component, OnInit } from '@angular/core';
import { EvacuationFileSearchResult, RegistrantProfileSearchResult } from 'src/app/core/api/models';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { EvacueeSearchService } from '../evacuee-search.service';
import { EvacueeSearchResultsService } from './evacuee-search-results.service';

@Component({
  selector: 'app-evacuee-search-results',
  templateUrl: './evacuee-search-results.component.html',
  styleUrls: ['./evacuee-search-results.component.scss']
})
export class EvacueeSearchResultsComponent implements OnInit {

  matchedRegistrants: Array<RegistrantProfileSearchResult>;
  matchedFiles: Array<EvacuationFileSearchResult>;
  evacueeSearchContext: EvacueeSearchContextModel;

  constructor(private evacueeSearchResultsService: EvacueeSearchResultsService, private evacueeSearchService: EvacueeSearchService) {
    // this.evacueeSearchService.setEvacueeSearchContext({
    //   hasShownIdentification: true,
    //   evacueeSearchParameters: { firstName: 'string', lastName: 'string', dateOfBirth: 'string' }
    // });
  }

  ngOnInit(): void {
    this.searchForEvacuee(this.evacueeSearchContext = this.evacueeSearchService.getEvacueeSearchContext());
  }

  searchAgain(): void {
    console.log('here');
  }

  searchForEvacuee(evacueeSearchContext: EvacueeSearchContextModel): void {
    this.evacueeSearchResultsService.searchForEvacuee(evacueeSearchContext.evacueeSearchParameters).subscribe((results) => {
      this.matchedFiles = results.files;
      this.matchedRegistrants = results.registrants;
    }, (error) => {
      console.log(error);
    });
  }

}
