import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        CaptchaComponent,
    ],
    exports: [
        CaptchaComponent,
    ]
})
export class CoreModule { }
