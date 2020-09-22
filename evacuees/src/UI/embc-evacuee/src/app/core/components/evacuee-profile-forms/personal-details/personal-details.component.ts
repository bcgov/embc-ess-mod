import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormCreationService } from '../../../services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../directives/directives.module';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export default class PersonalDetailsComponent implements OnInit {

  personalDetailsForm: FormGroup;
  gender: Array<string> = new Array<string>();
  formBuilder: FormBuilder;
  personalDetailsForm$: Subscription;
  formCreationService: FormCreationService;

  constructor(@Inject('formBuilder') formBuilder: FormBuilder, @Inject('formCreationService') formCreationService: FormCreationService) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.personalDetailsForm$ = this.formCreationService.getPeronalDetailsForm().subscribe(
      personalDetails => {
        this.personalDetailsForm = personalDetails;
      }
    );
    this.gender = ['Male', 'Female', 'X'];
  }

  /**
   * Returns the control of the form
   */
  get personalFormControl(): { [key: string]: AbstractControl; } {
    return this.personalDetailsForm.controls;
  }


}


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [
    PersonalDetailsComponent,
  ]
})
class PersonalDetailsModule {

}
