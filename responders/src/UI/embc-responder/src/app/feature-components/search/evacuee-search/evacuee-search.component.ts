import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evacuee-search',
  templateUrl: './evacuee-search.component.html',
  styleUrls: ['./evacuee-search.component.scss']
})
export class EvacueeSearchComponent implements OnInit {

  showPhotoIDComponent = true;

  constructor() { }

  ngOnInit(): void {
  }

  changeComponent(value: boolean) {
    this.showPhotoIDComponent = value;
  }

}
