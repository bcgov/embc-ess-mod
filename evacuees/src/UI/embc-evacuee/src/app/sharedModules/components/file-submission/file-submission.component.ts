import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-file-submission',
  templateUrl: './file-submission.component.html',
  styleUrls: ['./file-submission.component.scss']
})
export class FileSubmissionComponent implements OnInit {

  referenceNumber: string;
  panelOpenState = false;
  currentFlow: string;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    const registrationResult = this.dataService.getRegistrationResult();
    if (registrationResult) {
      this.referenceNumber = registrationResult.referenceNumber;
      if(!this.referenceNumber) {
        this.referenceNumber = "XXX";
      }
    }
  }

  goToProfile(): void {
    this.router.navigate(['/verified-registration/view-profile']);
  }

}
