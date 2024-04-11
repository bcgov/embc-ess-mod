import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from '../../core/services/formCreation.service';
import {
  CaptchaResponse,
  CaptchaResponseType
} from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ConfigService } from 'src/app/core/services/config.service';
import { IdentifyNeedsForm } from 'src/app/core/model/needs.model';
import { UntypedFormGroup } from '@angular/forms';
import { ShelterType } from 'src/app/core/services/globalConstants';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Output() captchaPassed = new EventEmitter<CaptchaResponse>();
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;
  @Input() allowEdit: boolean;
  componentToLoad: Observable<any>;
  cs: any;
  siteKey: string;

  hideCard = false;
  navigationExtras: NavigationExtras;

  constructor(
    private router: Router,
    public formCreationService: FormCreationService
  ) { }

  ngOnInit(): void {
    this.navigationExtras = { state: { parentPageName: this.parentPageName } };
    if (this.currentFlow === 'verified-registration') {
      this.captchaPassed.emit({
        type: CaptchaResponseType.success
      });
    }
  }

  editDetails(componentToEdit: string): void {
    let route: string;
    if (this.currentFlow === 'non-verified-registration') {
      route = '/non-verified-registration/edit/' + componentToEdit;
    } else {
      route = '/verified-registration/edit/' + componentToEdit;
    }
    this.router.navigate([route], this.navigationExtras);
  }

  back(): void {
    this.hideCard = false;
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaPassed.emit($event);
  }

  public getNeedsIdentifiedCaptions(form: UntypedFormGroup): string[] {
    const needs: string[] = [];
    if (form.controls.requiresClothing?.value) {
      needs.push('Clothing');
    }
    if (form.controls.requiresFood?.value) {
      needs.push('Food');
    }
    if (form.controls.requiresIncidentals?.value) {
      needs.push('Incidentals');
    }
    if (form.controls.requiresShelterType?.value === ShelterType.referral) {
      needs.push('Shelter referral');
    } else if (form.controls.requiresShelterType?.value === ShelterType.allowance) {
      needs.push('Shelter allowance');
    }
    return needs;
  }
}
