import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvacuationCard, Referral} from 'src/app/sharedModules/components/view-auth-profile/view-auth-profile.component';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit {

  @Input() evacuationFileCard: EvacuationCard;
  @Input() allExpandState = false;
  @Output() showEvacuationList = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute) { }

  backArrowImgSrc = '/assets/images/back_arrow.svg';
  type = 'need';
  currentFlow: string;
  parentPageName = 'needs-assessment';
  referralDetailsText = 'expand all';
  //expandDetailsFlag = false;

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  changeStatusColor(): string {
    if (this.evacuationFileCard.status === 'Active') {
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

  expandDetails(event: boolean){
    this.allExpandState = !this.allExpandState;
    if(this.allExpandState) {
      this.referralDetailsText = 'close all';
    } else {
      this.referralDetailsText = 'expand all';
    }

    console.log(event);
  }

  setInactiveListView(event: boolean): void {
    //this.showInactiveList = event;
  }

}
