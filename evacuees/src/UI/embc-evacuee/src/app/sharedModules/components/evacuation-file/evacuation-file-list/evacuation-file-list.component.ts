import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NeedsAssessment } from 'src/app/core/api/models';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { EvacuationFileDataService } from '../evacuation-file-data.service';

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
  selector: 'app-evacuation-file-list',
  templateUrl: './evacuation-file-list.component.html',
  styleUrls: ['./evacuation-file-list.component.scss']
})
export class EvacuationFileListComponent implements OnInit {

  dataSourceActive: Array<NeedsAssessment>;
  dataSourceInactive: Array<NeedsAssessment>;
  showActiveList = true;
  showInactiveList = true;
  currentChild: EvacuationCardComponent;
  evacuatedFrom?: string;
  currentPath: string;

  constructor(private dialogService: DialogService, private evacuationFileDataService: EvacuationFileDataService) { }

  ngOnInit(): void {

    this.dataSourceActive = this.evacuationFileDataService.getCurrentEvacuationFiles();
    this.dataSourceInactive = this.evacuationFileDataService.getPastEvacuationFiles();

    //this.evacuatedFrom = this.dataSourceActive[this.dataSourceActive.length - 1]?.from;

    this.currentPath = window.location.pathname;
    console.log(this.currentPath)
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
