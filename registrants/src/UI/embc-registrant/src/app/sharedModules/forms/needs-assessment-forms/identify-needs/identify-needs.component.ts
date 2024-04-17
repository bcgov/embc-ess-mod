import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DialogContent } from 'src/app/core/model/dialog-content.model';

@Component({
  selector: 'app-identify-needs',
  templateUrl: './identify-needs.component.html',
  styleUrls: ['./identify-needs.component.scss']
})
export default class IdentifyNeedsComponent implements OnInit {
  identifyNeedsForm: UntypedFormGroup;
  identifyNeedsForm$: Subscription;

  constructor(
    private formCreationService: FormCreationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.identifyNeedsForm$ = this.formCreationService.getIndentifyNeedsForm().subscribe((identifyNeedsForm) => {
      this.identifyNeedsForm = identifyNeedsForm;
    });
  }

  public openShelterAllowanceDialog() {
    this.openInfoDialog(globalConst.shelterAllowanceNeedDialog);
  }

  public openShelterReferralDialog() {
    this.openInfoDialog(globalConst.shelterReferralNeedDialog);
  }

  public openIncidentalsDialog() {
    this.openInfoDialog(globalConst.incidentalsNeedDialog);
  }

  private openInfoDialog(dialog: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: dialog
      },
      maxWidth: '400px'
    });
  }

  public get needsFormControl(): { [key: string]: AbstractControl } {
    return this.identifyNeedsForm.controls;
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  declarations: [IdentifyNeedsComponent]
})
class IdentifyNeedsModule {}
