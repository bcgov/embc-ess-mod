import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { evacuationCard } from 'src/app/sharedModules/components/view-auth-profile/view-auth-profile.component'

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})

export class EvacuationCardComponent implements OnInit {
 
  
  @Input() evacuationFileCard: evacuationCard;
  @Output() showEvacuationList = new EventEmitter<boolean>();
  @Output() evacuationFile = new EventEmitter<evacuationCard>();

  constructor() { }
  
  ngOnInit(): void {
    
  }

  changeStatusColor(): string {
    if(this.evacuationFileCard.status == 'Active'){
      return '#26B378';
    } else {
      return '#8B0000';
    }
  }

  goToDetails(){
    this.showEvacuationList.emit(false);
    this.evacuationFile.emit(this.evacuationFileCard);
  }

}