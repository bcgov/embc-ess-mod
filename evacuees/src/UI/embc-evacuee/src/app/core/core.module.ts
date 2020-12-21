import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        CaptchaComponent,
        AppLoaderComponent,
        AlertComponent
    ],
    exports: [
        CaptchaComponent,
        AppLoaderComponent,
        AlertComponent
    ]
})
export class CoreModule { }
