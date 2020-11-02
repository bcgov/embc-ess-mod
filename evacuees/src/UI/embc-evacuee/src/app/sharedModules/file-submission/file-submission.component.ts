import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-file-submission',
  templateUrl: './file-submission.component.html',
  styleUrls: ['./file-submission.component.scss']
})
export class FileSubmissionComponent implements OnInit {

  referenceNumber: string;
  panelOpenState = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    let registrationResult = this.dataService.getRegistrationResult();
    if(registrationResult) {
      this.referenceNumber = registrationResult.referenceNumber;
    }
  }

}
