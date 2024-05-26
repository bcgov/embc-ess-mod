import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from '../../core/services/formCreation.service';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { UntypedFormGroup } from '@angular/forms';
import { ShelterType } from 'src/app/core/services/globalConstants';
import { CustomDate } from '../../core/pipe/customDate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { CaptchaV2Component } from '../../core/components/captcha-v2/captcha-v2.component';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NeedsAssessmentSteps } from 'src/app/core/services/componentCreation.service';
import { EvacuationFileDataService } from 'src/app/sharedModules/components/evacuation-file/evacuation-file-data.service';
import { EvacuationFileStatus } from 'src/app/core/api/models';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone: true,
  imports: [MatCardModule, NgTemplateOutlet, CaptchaV2Component, MatButtonModule, AsyncPipe, CustomDate]
})
export class ReviewComponent implements OnInit {
  EvacuationFileStatus = EvacuationFileStatus;
  NeedsAssessmentSteps = NeedsAssessmentSteps;
  essFileId = input<string | undefined>();

  @Output() captchaPassed = new EventEmitter<CaptchaResponse>();
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;
  @Input() allowEdit: boolean;

  @Output() editStep = new EventEmitter<string>();
  componentToLoad: Observable<any>;
  cs: any;
  siteKey: string;

  hideCard = false;
  navigationExtras: NavigationExtras;

  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    public evacuationFileDataService: EvacuationFileDataService
  ) {}

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

  editNeedsAssessment(componentToEdit: string): void {
    if (this.essFileId()) {
      // convert to needs assessment step name, used to find the index of the step
      if (['family-information', 'pets'].includes(componentToEdit))
        componentToEdit = NeedsAssessmentSteps.FamilyAndPetsInformation;
      this.editStep.emit(componentToEdit);
    } else {
      this.editDetails(componentToEdit);
    }
  }

  back(): void {
    this.hideCard = false;
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaPassed.emit($event);
  }

  isNoNeedSelected(form: UntypedFormGroup) {
    const needsFormValue = form.value as any;
    return [
      needsFormValue.requiresClothing,
      needsFormValue.requiresFood,
      needsFormValue.requiresIncidentals,
      needsFormValue.requiresShelter
    ].every((need) => !need);
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
      needs.push('Shelter');
    } else if (form.controls.requiresShelterType?.value === ShelterType.allowance) {
      needs.push('Shelter allowance');
    }

    if (form.controls.requiresNothing?.value || this.isNoNeedSelected(form)) {
      needs.push('Household currently does not require assistance.');
    }

    return needs;
  }
}
