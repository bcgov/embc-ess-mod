import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-essfile-security-phrase',
  templateUrl: './essfile-security-phrase.component.html',
  styleUrls: ['./essfile-security-phrase.component.scss']
})
export class EssfileSecurityPhraseComponent implements OnInit {
  securityPhraseForm: FormGroup;
  securityPhrase: GetSecurityPhraseResponse;
  attemptsRemaning = 3;
  isLoading = false;
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
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.createSecurityPhraseForm();

    if (this.evacueeSessionService.essFileNumber === undefined) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else {
      this.essFileSecurityPhraseService
        .getSecurityPhrase(this.evacueeSessionService.essFileNumber)
        .subscribe(
          (results) => {
            this.securityPhrase = results;
          },
          (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.securityPhraseError
            );
          }
        );
    }
  }

  /**
   * Function that redirects to Search Results page
   */
  goToSearchResults() {
    this.router.navigate(['responder-access/search/evacuee']);
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
      .subscribe(
        (results) => {
          console.log(results);
          this.showLoader = !this.showLoader;
          if (results.isCorrect) {
            this.wrongAnswerFlag = false;
            this.correctAnswerFlag = true;

            if (this.evacueeSessionService.fileLinkFlag === 'Y') {
              this.evacueeProfileService
                .linkMemberProfile(this.evacueeSessionService.fileLinkMetaData)
                .subscribe(
                  (value) => {
                    this.evacueeSessionService.fileLinkStatus = 'S';
                    console.log(this.evacueeSessionService.fileLinkStatus);
                    this.router.navigate([
                      'responder-access/search/evacuee-profile-dashboard'
                    ]);
                  },
                  (error) => {
                    this.evacueeSessionService.fileLinkStatus = 'E';
                    this.router.navigate([
                      'responder-access/search/evacuee-profile-dashboard'
                    ]);
                  }
                );
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
        (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.verifySecurityPhraseError
          );
        }
      );
  }

  /**
   * Function that redirects to Evacuation Registration page
   */
  goToEvacRegistration() {
    this.router.navigate(['ess-wizard/evacuee-profile/collection-notice']);
  }

  private createSecurityPhraseForm() {
    this.securityPhraseForm = this.formBuilder.group({
      phraseAnswer: ['']
    });
  }
}
