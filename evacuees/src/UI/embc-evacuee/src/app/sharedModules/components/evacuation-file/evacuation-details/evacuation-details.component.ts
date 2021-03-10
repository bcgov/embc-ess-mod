import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NeedsAssessment } from 'src/app/core/api/models';
import { DataUpdationService } from 'src/app/core/services/dataUpdation.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { NeedsAssessmentMappingService } from '../../needs-assessment/needs-assessment-mapping.service';

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

  @Input() evacuationFileCard: NeedsAssessment;
  @Input() evacuationFileStatus: string;
  @Input() allExpandState = false;
  @Output() showEvacuationList = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute, private needsAssessmentMapping: NeedsAssessmentMappingService,
    public formCreationService: FormCreationService) { }

  backArrowImgSrc = '/assets/images/back_arrow.svg';
  type = 'need';
  currentFlow: string;
  parentPageName = 'needs-assessment';
  referralDetailsText = 'expand all';
  referralData = [];

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.needsAssessmentMapping.setNeedsAssessment(this.evacuationFileCard);
  }

  changeStatusColor(): string {
    if (this.evacuationFileStatus === 'Active') {
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToCurrent(): void {
    this.showEvacuationList.emit(true);
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
