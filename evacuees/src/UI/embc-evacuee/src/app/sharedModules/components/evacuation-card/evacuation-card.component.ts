import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { evacuationCard } from 'src/app/sharedModules/components/view-auth-profile/view-auth-profile.component'

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})

export class EvacuationCardComponent implements OnInit {

  showDetails = false;
  type = 'need'
  currentFlow: string;
  parentPageName = 'needs-assessment';
  
  @Input() evacuationFileCard: evacuationCard;
  @Output() showCardHeading = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  changeStatusColor(): string {
    if(this.evacuationFileCard.status == 'Active'){
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToDetails(){
    this.showDetails = !this.showDetails;
    this.showCardHeading.emit(false);
  }

  goToCurrent(): void {
    this.showDetails = !this.showDetails;
    this.showCardHeading.emit(true);
  }

}