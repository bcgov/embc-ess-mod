import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { DataService } from 'src/app/core/services/data.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { debounceTime, filter } from 'rxjs/operators';

export interface EvacuationCard {
  from: string;
  date: string;
  code: number;
  support: string;
  status: string;
  referral: boolean;
  referrals?: Referral[];
}

export interface Referral {
  referralDate: string;
  referralDetails: ReferralDetails[];
}

export interface ReferralDetails {
  provider: string;
  type: string;
  issuedTo: string;
  expiry: string;
  code: string;
  amount: string;
  status: string;
  providedTo: string[];
  providerDetails: string;
  issuedBy: string;
}

const ACTIVE_DATA: EvacuationCard[] = [
  { from: 'Victoria', date: '20-Feb-2020', code: 333333, support: 'No', status: 'Active', referral: false },
  {
    from: 'Vancouver', date: '20-Feb-2020', code: 444444, support: 'No', status: 'Active', referral: true,
    referrals: [{
      referralDate: '07-Sep-2020', referralDetails: [{
        provider: 'e-Transfer', type: 'Food-Groceries', issuedTo: 'Smith, John',
        expiry: 'n/a', code: 'P356211', amount: '$50', status: 'Active', providedTo: ['Smith, John', 'Smith, Jenna',
          'Smith, Michael', 'Smith, Lily'], providerDetails: 'e-Transfer issued to jsmith@gmail.com',
        issuedBy: 'Oak Bay ESS Team'
      }]
    }]
  },
];

const INACTIVE_DATA: EvacuationCard[] = [
  {
    from: 'Victoria', date: '20-Feb-2020', code: 123456, support: 'No', status: 'Inactive', referral: true,
    referrals: [{
      referralDate: '07-Sep-2020', referralDetails: [{
        provider: 'e-Transfer', type: 'Food-Groceries', issuedTo: 'Smith, John', expiry: 'n/a', code: 'P356211', amount: '$50',
        status: 'Active', providedTo: ['Smith, John', 'Smith, Jenna', 'Smith, Michael', 'Smith, Lily'],
        providerDetails: 'e-Transfer issued to jsmith@gmail.com', issuedBy: 'Oak Bay ESS Team'
      }]
    },
    {
      referralDate: '04-Sep-2020', referralDetails: [{
        provider: 'e-Transfer', type: 'Food-Groceries', issuedTo: 'Smith, John', expiry: 'n/a', code: 'P356211', amount: '$50',
        status: 'Active', providedTo: ['Smith, John', 'Smith, Jenna', 'Smith, Michael', 'Smith, Lily'],
        providerDetails: 'e-Transfer issued to jsmith@gmail.com', issuedBy: 'Oak Bay ESS Team'
      },
      {
        provider: 'Great Hotel Ltd', type: 'Lodging - Hotel/Motel', issuedTo: 'Smith, John', expiry: 'mm/dd/yyyy', code: 'D12345',
        amount: 'n/a', status: 'Active', providedTo: ['Smith, John', 'Smith, Jenna', 'Smith, Michael', 'Smith, Lily'],
        providerDetails: 'Great Hotel ltd Address1 Address 2 City Province Postal Code', issuedBy: 'Oak Bay ESS Team'
      }]
    }]
  }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class ViewAuthProfileComponent implements OnInit {

  type = 'profile';
  currentFlow: string;
  parentPageName = 'view-profile';
  dataSourceActive = ACTIVE_DATA;
  dataSourceInactive = INACTIVE_DATA;
  showActiveList = true;
  showInactiveList = true;
  currentChild: EvacuationCardComponent;

  evacuatedFrom?: string;
  referenceNumber: string;


  constructor(
    private route: ActivatedRoute, private dataService: DataService, public formCreationService: FormCreationService,
    private router: Router, private dialogService: DialogService) { }


  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.evacuatedFrom = this.dataSourceActive[this.dataSourceActive.length - 1]?.from;

    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      debounceTime(500)
    ).subscribe(() =>
      this.openReferenceNumberPopup()
    );

    // this.openDOBMismatchPopup();
  }

  openDOBMismatchPopup(): void {
    this.dialogService.dateOfBirthMismatch('02 Mar 1984', '02 Mar 1983');
  }

  openReferenceNumberPopup(): void {
    const registrationResult = this.dataService.getRegistrationResult();
    if (registrationResult.referenceNumber !== null) {
      this.referenceNumber = registrationResult.referenceNumber;
      console.log(this.referenceNumber);
      this.dialogService.submissionCompleteDialog(this.referenceNumber);
    }
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }


  startAdditionalAssessment(): void {
    this.dialogService.addEvacuationFile(this.evacuatedFrom);
  }


  setActiveListView(event: boolean): void {
    this.showActiveList = event;
  }

  setInactiveListView(event: boolean): void {
    this.showInactiveList = event;
  }

  setCurrentChild(fileCard: EvacuationCardComponent): void {
    this.currentChild = fileCard;
  }

  goBackActive(): void {
    this.showActiveList = !this.showActiveList;
  }

  goBackInactive(): void {
    this.showInactiveList = !this.showInactiveList;
  }

  resetTab($event): void {
    this.showActiveList = true;
    this.showInactiveList = true;
  }

}
