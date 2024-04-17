import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CaptchaV2Component } from './components/captcha-v2/captcha-v2.component';

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
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  declarations: [
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
    AppLoaderComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    EnvironmentBannerComponent,
    TimeOutDialogComponent,
    MatToolbarModule,
    MatButtonModule
  ]
})
export class CoreModule {}
