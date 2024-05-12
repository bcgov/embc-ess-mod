import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepEssFileService } from '../../step-ess-file/step-ess-file.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { AnimalsComponent } from '../animals/animals.component';
import { HouseholdMembersComponent } from '../household-members/household-members.component';

@Component({
  selector: 'app-household-members-pets',
  templateUrl: './household-members-pets.component.html',
  styleUrls: ['./household-members-pets.component.scss'],
  standalone: true,
  imports: [HouseholdMembersComponent, AnimalsComponent, MatButton]
})
export class HouseholdMembersPetsComponent implements OnInit, OnDestroy {
  petsValid = false;
  householdMembersValid = false;
  tabUpdateSubscription: Subscription;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService
  ) {}

  ngOnInit(): void {
    this.tabMetaData = this.stepEssFileService.getNavLinks('household-members-pets');
    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepEssFileService.nextTabUpdate.subscribe(() => {
      this.updateTabStatus();
    });

    this.updateTabStatus();
  }

  ngOnDestroy(): void {
    this.tabUpdateSubscription.unsubscribe();
    this.stepEssFileService.nextTabUpdate.next();
  }

  /**
   * Goes back to the previous ESS File Tab
   */
  back() {
    this.updateTabStatus();
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Goes to the next tab from the ESS File
   */
  next(): void {
    this.updateTabStatus();
    this.router.navigate([this.tabMetaData?.next]);
  }
  validPetsIndicator(data): void {
    this.petsValid = data;
    this.updateTabStatus();
  }

  validHouseholdMemebersIndicator(data): void {
    this.householdMembersValid = data;
    this.updateTabStatus();
  }

  private updateTabStatus() {
    if (this.petsValid && this.householdMembersValid) {
      this.stepEssFileService.setTabStatus('household-members-pets', 'complete');
    } else if (!this.petsValid && !this.householdMembersValid) {
      this.stepEssFileService.setTabStatus('household-members-pets', 'not-started');
    } else if (!this.petsValid || !this.householdMembersValid) {
      this.stepEssFileService.setTabStatus('household-members-pets', 'incomplete');
    }
  }
}
