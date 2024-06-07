import { Component, OnInit, NgModule, Inject, Input } from '@angular/core';

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
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from 'src/app/core/model/dialog-content.model';

@Component({
  selector: 'app-identify-needs',
  templateUrl: './identify-needs.component.html',
  styleUrls: ['./identify-needs.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatCheckboxModule, MatRadioModule]
})
export default class IdentifyNeedsComponent implements OnInit {
  _form: UntypedFormGroup;

  @Input()
  set form(form: UntypedFormGroup) {
    this._form = form;
    this.identifyNeedsForm = form;
  }

  identifyNeedsForm: UntypedFormGroup = this.formCreationService.createNeedsForm();
  identifyNeedsForm$: Subscription;

  constructor(
    private formCreationService: FormCreationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this._form) {
      this.identifyNeedsForm$ = this.formCreationService.getIndentifyNeedsForm().subscribe((identifyNeedsForm) => {
        this.identifyNeedsForm = identifyNeedsForm;
      });
    }
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
}
