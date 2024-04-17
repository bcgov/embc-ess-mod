import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, AbstractControl } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export default class SecretComponent implements OnInit, OnDestroy {
  formBuilder: UntypedFormBuilder;
  secretForm$: Subscription;
  secretForm: UntypedFormGroup;
  formCreationService: FormCreationService;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.secretForm$ = this.formCreationService.getSecretForm().subscribe((secretForm) => {
      this.secretForm = secretForm;
    });
  }

  /**
   * Returns the control of the form
   */
  get secretFormControl(): { [key: string]: AbstractControl } {
    return this.secretForm.controls;
  }

  ngOnDestroy(): void {
    this.secretForm$.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  declarations: [SecretComponent]
})
class SecretModule {}
