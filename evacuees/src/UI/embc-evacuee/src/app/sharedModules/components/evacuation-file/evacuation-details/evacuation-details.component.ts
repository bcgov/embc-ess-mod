import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EvacuationFile, NeedsAssessment } from 'src/app/core/api/models';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { NeedsAssessmentMappingService } from '../../needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileService } from '../evacuation-file.service';

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

const REFERRALS: Referral[] = [{
  referralDate: '07-Sep-2020', referralDetails: [{
    provider: 'e-Transfer', type: 'Food-Groceries', issuedTo: 'Smith, John',
    expiry: 'n/a', code: 'P356211', amount: '$50', status: 'Active', providedTo: ['Smith, John', 'Smith, Jenna',
      'Smith, Michael', 'Smith, Lily'], providerDetails: 'e-Transfer issued to jsmith@gmail.com',
    issuedBy: 'Oak Bay ESS Team'
  }]
}];

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit {

  @Input() allExpandState = false;

  previousUrl: string;
  evacuationFileTab: string;

  constructor(
    private route: ActivatedRoute, public formCreationService: FormCreationService,
    public evacuationFilesService: EvacuationFileService, private router: Router,
    public evacuationFileDataService: EvacuationFileDataService) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('prev:', event.url);
        this.previousUrl = event.url;
      });
  }

  backArrowImgSrc = '/assets/images/back_arrow.svg';
  type = 'need';
  currentFlow: string;
  parentPageName = 'needs-assessment';
  referralDetailsText = 'expand all';
  referralData = [];

  showActiveList = true;
  showInactiveList = true;

  ngOnInit(): void {
    if (this.previousUrl.includes('current')) {
      this.evacuationFileTab = 'Current';
    } else {
      this.evacuationFileTab = 'Past';
    }
  }

  changeStatusColor(): string {
    if (this.evacuationFileDataService.evacuationFileStatus === 'Active') {
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToCurrent(): void {
    if (this.previousUrl.includes('current')) {
      this.router.navigate(['/verified-registration/dashboard/current']);
    } else {
      this.router.navigate(['/verified-registration/dashboard/past']);
    }
  }

  onMouseOver(): void {
    this.backArrowImgSrc = '/assets/images/back_arrow_hover.svg';
  }

  onMouseOut(): void {
    this.backArrowImgSrc = '/assets/images/back_arrow.svg';
  }

  expandDetails(): void {
    this.allExpandState = !this.allExpandState;
    if (this.allExpandState) {
      this.referralDetailsText = 'close all';
    } else {
      this.referralDetailsText = 'expand all';
    }
  }

}
