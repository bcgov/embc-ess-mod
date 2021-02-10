import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { FormCreationService } from '../core/services/formCreation.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {

  constructor(
    private formCreationService: FormCreationService, private dataService: DataService) {
    this.dataService.clearData();
    this.formCreationService.clearData();
  }

  ngOnInit(): void {
  }
}
