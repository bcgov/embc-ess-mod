import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvacuationCard } from 'src/app/sharedModules/components/view-auth-profile/view-auth-profile.component';

@Component({
  selector: 'app-evacuation-details',
  templateUrl: './evacuation-details.component.html',
  styleUrls: ['./evacuation-details.component.scss']
})
export class EvacuationDetailsComponent implements OnInit {

  @Input() evacuationFileCard: EvacuationCard;
  @Output() showEvacuationList = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute) { }

  type = 'need';
  currentFlow: string;
  parentPageName = 'needs-assessment';

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

}
