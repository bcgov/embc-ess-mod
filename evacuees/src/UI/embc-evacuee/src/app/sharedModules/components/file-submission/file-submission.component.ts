import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../../core/services/data.service';

let browserRefresh = false;

@Component({
  selector: 'app-file-submission',
  templateUrl: './file-submission.component.html',
  styleUrls: ['./file-submission.component.scss']
})
export class FileSubmissionComponent implements OnInit {

  referenceNumber: string;
  panelOpenState = false;
  currentFlow: string;

  subscription: Subscription;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router,
    public location: Location) { }

  // ngOnDestroy(): void {
  //   this.location.subscribe(state => {
  //     history.pushState(null, null, window.location.pathname);
  //   })
  // }

  /**
   * Initializes the user flow and fetches the registration
   * number
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    const registrationResult = this.dataService.getRegistrationResult();
    if (registrationResult) {
      this.referenceNumber = registrationResult.referenceNumber;
      if (!this.referenceNumber) {
        this.router.navigate(['/']);
      }
    }
  }

  /**
   * Navigates to dashboard page
   */
  goToProfile(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  verifyUser(): void {
    //this.router.navigate(['/verified-registration'], { replaceUrl: true });
    window.location.replace('/verified-registration');
  }

}
