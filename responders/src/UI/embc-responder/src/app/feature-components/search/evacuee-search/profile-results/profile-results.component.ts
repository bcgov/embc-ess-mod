import { Component, Input, OnInit } from '@angular/core';
import { RegistrantProfileSearchResult } from 'src/app/core/api/models';

@Component({
  selector: 'app-profile-results',
  templateUrl: './profile-results.component.html',
  styleUrls: ['./profile-results.component.scss']
})
export class ProfileResultsComponent implements OnInit {

  @Input() matchedRegistrants: Array<RegistrantProfileSearchResult>;

  constructor() { }

  ngOnInit(): void {
  }

}