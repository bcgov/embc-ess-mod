import { Component, OnInit, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-identify-needs',
  templateUrl: './identify-needs.component.html',
  styleUrls: ['./identify-needs.component.scss']
})
export default class IdentifyNeedsComponent implements OnInit {

  identifyNeedsForm: FormGroup;
  formBuilder: FormBuilder;
  identifyNeedsForm$: Subscription;
  formCreationService: FormCreationService;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
   }

  ngOnInit(): void {
    this.identifyNeedsForm$ = this.formCreationService.getIndentifyNeedsForm().subscribe(
      identifyNeedsForm => {
        this.identifyNeedsForm = identifyNeedsForm;
      }
    );
  }

  get needsFormControl(): { [key: string]: AbstractControl; } {
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
    MatRadioModule
  ],
  declarations: [
    IdentifyNeedsComponent,
    ]
})
class IdentifyNeedsModule {

}
