import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EssFileDialogComponent } from './components/dialog-components/ess-file-dialog/ess-file-dialog.component';
import { InformationDialogComponent } from './components/dialog-components/information-dialog/information-dialog.component';
import { BcscInviteDialogComponent } from './components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EnvironmentBannerComponent } from './layout/environment-banner/environment-banner.component';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { TimeOutDialogComponent } from './components/dialog-components/time-out-dialog/time-out-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  declarations: [
    CaptchaComponent,
    AppLoaderComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    EssFileDialogComponent,
    InformationDialogComponent,
    BcscInviteDialogComponent,
    EnvironmentBannerComponent,
    TimeOutDialogComponent
  ],
  exports: [
    CaptchaComponent,
    AppLoaderComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    EnvironmentBannerComponent,
    TimeOutDialogComponent
  ]
})
export class CoreModule {}
