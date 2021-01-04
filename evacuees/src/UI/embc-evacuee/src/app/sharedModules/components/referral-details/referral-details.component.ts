import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Referral, ReferralDetails} from 'src/app/sharedModules/components/view-auth-profile/view-auth-profile.component';

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class ReferralDetailsComponent implements OnInit {

  @Input() evacuationReferral: Referral;
  @Input() allExpandState: boolean;

  panelOpenState = false;
  columnsToDisplay = ['provider', 'type', 'issuedTo', 'expiry', 'referral', 'amount'];
  expandedElement: ReferralDetails | null;

  constructor() { }

  ngOnInit(): void {
    console.log(this.evacuationReferral);
  }

}
