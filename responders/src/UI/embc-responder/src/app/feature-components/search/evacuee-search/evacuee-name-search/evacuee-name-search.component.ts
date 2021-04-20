import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evacuee-name-search',
  templateUrl: './evacuee-name-search.component.html',
  styleUrls: ['./evacuee-name-search.component.scss']
})
export class EvacueeNameSearchComponent implements OnInit {

  panel1OpenState = false;
  panel2OpenState = false;
  readonly dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor() { }

  ngOnInit(): void {
  }

}
