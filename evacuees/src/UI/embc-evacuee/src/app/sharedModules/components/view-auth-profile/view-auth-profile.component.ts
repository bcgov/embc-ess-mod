import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component'

export interface evacuationCard {
  date: string;
  code: number;
  support: string;
  status: string;
}

const ACTIVE_DATA: evacuationCard[] = [
  {date: "20-Feb-2020", code: 333333, support: "No", status: 'Active'},
  {date: "20-Feb-2020", code: 444444, support: "No", status: 'Active'},
  {date: "20-Feb-2020", code: 555555, support: "No", status: 'Active'},
];

const INACTIVE_DATA: evacuationCard[] = [
  {date: "20-Feb-2020", code: 123456, support: "No", status: 'Inactive'},
  {date: "20-Feb-2020", code: 123456, support: "No", status: 'Inactive'},
];

@Component({
  selector: 'app-view-auth-profile',
  templateUrl: './view-auth-profile.component.html',
  styleUrls: ['./view-auth-profile.component.scss']
})


export class ViewAuthProfileComponent implements OnInit {

  //@ViewChild(EvacuationCardComponent) cardComponent;

  type = 'profile';
  currentFlow: string;
  parentPageName = 'view-profile';
  dataSourceActive = ACTIVE_DATA;
  dataSourceInactive = INACTIVE_DATA;
  showActiveList = true;
  showInactiveList = true;
  currentChild: EvacuationCardComponent;


  constructor(private route: ActivatedRoute, public formCreationService: FormCreationService, private router: Router) { }
  

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
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

  goBackActive(){
    this.showActiveList = !this.showActiveList;
  }

  goBackInactive(){
    this.showInactiveList = !this.showInactiveList;
  }

  resetTab($event){
    this.showActiveList = true;
    this.showInactiveList = true;
  }

}
