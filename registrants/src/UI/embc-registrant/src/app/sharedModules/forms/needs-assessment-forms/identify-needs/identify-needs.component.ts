import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-identify-needs',
  templateUrl: './identify-needs.component.html',
  styleUrls: ['./identify-needs.component.scss']
})
export default class IdentifyNeedsComponent implements OnInit {
  identifyNeedsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  identifyNeedsForm$: Subscription;
  formCreationService: FormCreationService;

  constructor(@Inject('formBuilder') formBuilder: UntypedFormBuilder, @Inject('formCreationService') formCreationService: FormCreationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.identifyNeedsForm$ = this.formCreationService.getIndentifyNeedsForm().subscribe((identifyNeedsForm) => {
      this.identifyNeedsForm = identifyNeedsForm;
    });
  }

  public openShelterAllowanceDialog() {
    //this.openInfoDialog(globalConst.shelterAllowanceNeedDialog);
  }

  public openShelterReferralDialog() {
    //this.openInfoDialog(globalConst.shelterReferralNeedDialog);
  }

  public openIncidentalsDialog() {
    //this.openInfoDialog(globalConst.incidentalsNeedDialog);
  }

  // private openInfoDialog(dialog: DialogContent) {
  //   return this.dialog.open(DialogComponent, {
  //     data: {
  //       component: InformationDialogComponent,
  //       content: dialog
  //     },
  //     width: '400px'
  //   });
  // }

  public get needsFormControl(): { [key: string]: AbstractControl } {
    return this.identifyNeedsForm.controls;
  }
}

@NgModule({
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatRadioModule, MatCheckboxModule],
  declarations: [IdentifyNeedsComponent]
})
class IdentifyNeedsModule {}
