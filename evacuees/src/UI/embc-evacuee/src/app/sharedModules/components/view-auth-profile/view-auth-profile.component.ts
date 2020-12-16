import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationCardComponent } from '../evacuation-card/evacuation-card.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as globalConst from '../../../core/services/globalConstants';



export interface EvacuationCard {
  date: string;
  code: number;
  support: string;
  status: string;
}

const ACTIVE_DATA: EvacuationCard[] = [
  { date: '20-Feb-2020', code: 333333, support: 'No', status: 'Active' },
  { date: '20-Feb-2020', code: 444444, support: 'No', status: 'Active' },
  { date: '20-Feb-2020', code: 555555, support: 'No', status: 'Active' },
];

const INACTIVE_DATA: EvacuationCard[] = [
  { date: '20-Feb-2020', code: 123456, support: 'No', status: 'Inactive' },
  { date: '20-Feb-2020', code: 123456, support: 'No', status: 'Inactive' },
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
  showActiveList = true;
  showInactiveList = true;
  currentChild: EvacuationCardComponent;


  constructor(private route: ActivatedRoute, public formCreationService: FormCreationService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
  }

  startAssessment1(): void {
    this.router.navigate(['/verified-registration/confirm-restriction']);
  }

  startAssessment(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Add Another Evacuation File',
        body: 'We have you as currently evacuated from Victoria, has your situation changed?',
        buttons:
          [
            {
              name: 'No, Cancel',
              class: 'button-s',
              function: 'close'
            },
            {
              name: 'Yes, Continue',
              class: 'button-p',
              function: 'add'
            }
          ]
      },
      height: '250px',
      width: '600px'
    }).afterClosed().subscribe(result => {
      if (result === 'add') {
        this.router.navigate(['/verified-registration/confirm-restriction']);
      }
    });
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

  goBackActive(): void {
    this.showActiveList = !this.showActiveList;
  }

  goBackInactive(): void {
    this.showInactiveList = !this.showInactiveList;
  }

  resetTab($event): void {
    this.showActiveList = true;
    this.showInactiveList = true;
  }

}
