import { Component, Input, OnInit } from '@angular/core';
import { EvacuationFileSearchResult } from 'src/app/core/api/models';

@Component({
  selector: 'app-ess-files-results',
  templateUrl: './ess-files-results.component.html',
  styleUrls: ['./ess-files-results.component.scss']
})
export class EssFilesResultsComponent implements OnInit {

  @Input() matchedFiles: Array<EvacuationFileSearchResult>;

  constructor() { }

  ngOnInit(): void {
  }

}
