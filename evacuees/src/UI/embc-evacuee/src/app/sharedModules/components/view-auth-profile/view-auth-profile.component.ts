import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

export interface evacuationCard {
  date: string;
  code: number;
  support: string;
  status: string;
}

const ACTIVE_DATA: evacuationCard[] = [
  {date: "20-Feb-2020", code: 333333, support: "No", status: 'Active'},
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

  type = 'profile';
  currentFlow: string;
  parentPageName = 'view-profile';
  dataSourceActive = ACTIVE_DATA;
  dataSourceInactive = INACTIVE_DATA;
  showHeader = true;

  @ViewChild('activeFileDetails') activeFileDetails: TemplateRef<any>;


  constructor(private route: ActivatedRoute, public formCreationService: FormCreationService, private router: Router) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  startAssessment(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }

  setHeaders(event: boolean): void {
    this.showHeader = event;
  }

  actionTest(){
    console.log("HOLA");
  }

}
