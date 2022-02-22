import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GetSecurityPhraseResponse,
  VerifySecurityPhraseRequest
} from 'src/app/core/api/models';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EssFileSecurityPhraseService } from './essfile-security-phrase.service';
import * as globalConst from '../../../core/services/global-constants';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { Location } from '@angular/common';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-essfile-security-phrase',
  templateUrl: './essfile-security-phrase.component.html',
  styleUrls: ['./essfile-security-phrase.component.scss']
})
export class EssfileSecurityPhraseComponent implements OnInit {
  securityPhraseForm: FormGroup;
  securityPhrase: GetSecurityPhraseResponse;
  attemptsRemaning = 3;
  showLoader = false;
  correctAnswerFlag = false;
  wrongAnswerFlag = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    private essFileSecurityPhraseService: EssFileSecurityPhraseService,
    private evacueeSessionService: EvacueeSessionService,
    private evacueeProfileService: EvacueeProfileService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private cacheService: CacheService,
    private location: Location,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createSecurityPhraseForm();

    this.securityPhrase = this.essFileSecurityPhraseService.securityPhrase;
    if (
      this.evacueeSessionService.essFileNumber === undefined ||
      this.securityPhrase === undefined
    ) {
      this.router.navigate(['responder-access/search/evacuee']);
    }
  }

  /**
   * Function that redirects back
   */
  goBack() {
    this.location.back();
  }

  /**
   * Funtion that send answers to the backend and decided which screen to show according to backend response
   */
  next() {
    this.showLoader = !this.showLoader;
    const body: VerifySecurityPhraseRequest = {
      answer: this.securityPhraseForm.get('phraseAnswer').value
    };

    this.essFileSecurityPhraseService
      .verifySecurityPhrase(this.evacueeSessionService.essFileNumber, body)
      .subscribe({
        next: (results) => {
          this.showLoader = !this.showLoader;
          if (results.isCorrect) {
            this.wrongAnswerFlag = false;
            this.correctAnswerFlag = true;

            if (this.evacueeSessionService.fileLinkFlag === 'Y') {
              this.evacueeProfileService
                .linkMemberProfile(this.evacueeSessionService.fileLinkMetaData)
                .subscribe({
                  next: (value) => {
                    this.evacueeSessionService.fileLinkStatus = 'S';
                    this.router.navigate([
                      'responder-access/search/evacuee-profile-dashboard'
                    ]);
                  },
                  error: (error) => {
                    this.evacueeSessionService.fileLinkStatus = 'E';
                    this.router.navigate([
                      'responder-access/search/evacuee-profile-dashboard'
                    ]);
                  }
                });
            } else {
              setTimeout(() => {
                this.router.navigate([
                  'responder-access/search/essfile-dashboard'
                ]);
              }, 1000);
            }
          } else {
            this.securityPhraseForm.get('phraseAnswer').reset();
            this.attemptsRemaning--;
            this.wrongAnswerFlag = true;
          }
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.verifySecurityPhraseError
          );
        }
      });
  }

  /**
   * Function that redirects to Evacuation Registration page
   */
  goToEvacRegistration() {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/evacuee'
    );
    this.evacueeSessionService.setWizardType(WizardType.NewRegistration);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.NewRegistration },
      queryParamsHandling: 'merge'
    });
  }

  private createSecurityPhraseForm() {
    this.securityPhraseForm = this.formBuilder.group({
      phraseAnswer: ['', [this.customValidation.whitespaceValidator()]]
    });
  }
}
