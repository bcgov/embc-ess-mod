import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TabModel } from "src/app/core/models/tab.model";
import { CustomValidationService } from "src/app/core/services/customValidation.service";
import { StepEssFileService } from "../../step-ess-file/step-ess-file.service";
import { WizardService } from "../../wizard.service";

@Component({
  selector: 'app-household-members-pets',
  templateUrl: './household-members-pets.component.html',
  styleUrls: ['./household-members-pets.component.scss']
})


export class HouseholdMembersPetsComponent implements OnInit {


  petsValid = false;
  householdMembersValid = true;
  tabMetaData: TabModel;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private stepEssFileService: StepEssFileService,
    private customValidation: CustomValidationService,
    private formBuilder: UntypedFormBuilder,
    private wizardService: WizardService) {

  }


  ngOnInit(): void {
    this.tabMetaData = this.stepEssFileService.getNavLinks('household-members-pets');
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
  ValidPetsIndicator(data): void { this.petsValid = data }
  ValidHouseholdMemebersIndicator(data): void { this.householdMembersValid = data }

  private updateTabStatus() {
    if (this.petsValid && this.householdMembersValid) {
      this.stepEssFileService.setTabStatus('household-members-pets', 'complete');
    } else if (!this.petsValid || !this.householdMembersValid) {
      this.stepEssFileService.setTabStatus('household-members-pets', 'incomplete');
    }
    else {
      this.stepEssFileService.setTabStatus('household-members-pets', 'not-started');
    }
  }
}


