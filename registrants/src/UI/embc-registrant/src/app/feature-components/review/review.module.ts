import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from '../../core/pipe/customPipe.module';
import { CoreModule } from '../../core/core.module';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CaptchaV2Component } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReviewComponent, CaptchaV2Component],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CustomPipeModule,
    CoreModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    ReactiveFormsModule
  ],
  exports: [ReviewComponent]
})
export class ReviewModule {}
