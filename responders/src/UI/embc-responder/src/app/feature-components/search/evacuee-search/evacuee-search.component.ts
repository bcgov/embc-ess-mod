import { Component, OnInit } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';

@Component({
  selector: 'app-evacuee-search',
  templateUrl: './evacuee-search.component.html',
  styleUrls: ['./evacuee-search.component.scss']
})
export class EvacueeSearchComponent implements OnInit {

  showPhotoIDComponent = true;
  showResultsComponent = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeVerifyIdComponent(value: boolean) {
    this.showPhotoIDComponent = value;
  }

  changeResultsComponent(value: boolean) {
    this.showResultsComponent = value;
  }

}
