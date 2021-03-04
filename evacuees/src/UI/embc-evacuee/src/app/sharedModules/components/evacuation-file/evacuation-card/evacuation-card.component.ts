import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NeedsAssessment } from 'src/app/core/api/models';
import { EvacuationCard } from '../evacuation-file-list/evacuation-file-list.component';

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})

export class EvacuationCardComponent implements OnInit {

  @Input() evacuationFileCard: NeedsAssessment;
  @Output() showEvacuationList = new EventEmitter<boolean>();
  @Output() evacuationFile = new EventEmitter<EvacuationCard>();

  imageIcon: string;

  constructor() { }

  ngOnInit(): void {
    this.changeStatusColor();
  }

  changeStatusColor(): void {
    if (this.evacuationFileCard.status === 'Active') {
      this.imageIcon = '/assets/images/active_status.svg';
    } else {
      this.imageIcon = '/assets/images/inactive_status.svg';
    }
  }

  goToDetails(): void {
    this.showEvacuationList.emit(false);
    this.evacuationFile.emit(this.evacuationFileCard);
  }

}
