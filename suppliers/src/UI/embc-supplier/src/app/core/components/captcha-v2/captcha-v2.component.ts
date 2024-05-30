import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ServerConfig } from '../../model/server-config';

@Component({
  selector: 'app-captcha-v2',
  templateUrl: './captcha-v2.component.html',
  styleUrls: ['./captcha-v2.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule]
})
export class CaptchaV2Component implements OnInit {
  @Output() captchaResponse = new EventEmitter<CaptchaResponse>();
  captchaForm: FormGroup;
  captchaKey: string;

  constructor(private configService: ConfigService) {
    this.configService?.getServerConfig()?.subscribe({
      next: (config: ServerConfig) => {
        this.captchaKey = config.captcha?.key;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.captchaForm = new FormGroup({
      token: new FormControl(null, Validators.required)
    });
  }

  resolved($event) {
    this.captchaResponse.emit({
      type: CaptchaResponseType.success,
      resolved: $event
    });
  }

  errored($event) {
    this.captchaResponse.emit({
      type: CaptchaResponseType.error,
      error: $event
    });
  }
}

export interface CaptchaResponse {
  type: CaptchaResponseType;
  resolved?: string;
  error?: string;
}

export enum CaptchaResponseType {
  success = 'SUCCESS',
  error = 'ERROR'
}
