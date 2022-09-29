import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-captcha-v2',
  templateUrl: './captcha-v2.component.html',
  styleUrls: ['./captcha-v2.component.scss']
})
export class CaptchaV2Component implements OnInit {
  @Output() captchaResponse = new EventEmitter<CaptchaResponse>();
  captchaForm: FormGroup;
  captchaKey: string;

  constructor(private configService: ConfigService) {
    this.captchaKey = this.configService?.configuration?.captcha?.key;
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
