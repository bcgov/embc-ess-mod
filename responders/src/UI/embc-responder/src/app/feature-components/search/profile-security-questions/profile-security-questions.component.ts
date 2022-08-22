import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SecurityQuestion,
  VerifySecurityQuestionsRequest
} from 'src/app/core/api/models';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { ProfileSecurityQuestionsService } from './profile-security-questions.service';
import * as globalConst from '../../../core/services/global-constants';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-profile-security-questions',
  templateUrl: './profile-security-questions.component.html',
  styleUrls: ['./profile-security-questions.component.scss']
})
export class ProfileSecurityQuestionsComponent implements OnInit {
  securityQuestionsForm: UntypedFormGroup;
  thirdSecurityQuestionForm: UntypedFormGroup;
  securityQuestions: Array<SecurityQuestion> = [];
  securityAnswers: Array<SecurityQuestion>;
  securityQuestionResult: number;
  firstTryCorrect: boolean;
  defaultScreen = true;
  incorrectScreen = false;
  correctAnswerFlag = false;
  showLoader = false;
  color = '#169BD5';
  evacueeProfileId: string;

  constructor(
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private router: Router,
    private evacueeSessionService: EvacueeSessionService,
    private formBuilder: UntypedFormBuilder,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private customValidation: CustomValidationService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.householdMemberRegistrantId !== undefined
    ) {
      this.evacueeProfileId =
        this.appBaseService?.appModel?.selectedProfile?.householdMemberRegistrantId;
    } else {
      this.evacueeProfileId =
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.id;
    }
    this.createAnswersForm();
    this.securityAnswers = [];
    this.firstTryCorrect = false;
    // this.securityQuestions =
    //   this.profileSecurityQuestionsService.shuffledSecurityQuestions;

    if (
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.id === undefined &&
      this.securityQuestions.length === 0
    ) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else if (this.securityQuestions.length === 0) {
      this.profileSecurityQuestionsService
        .getSecurityQuestions(this.evacueeProfileId)
        .subscribe({
          next: (results) => {
            this.profileSecurityQuestionsService.shuffleSecurityQuestions(
              results?.questions
            );
            this.securityQuestions =
              this.profileSecurityQuestionsService.shuffledSecurityQuestions;
          },
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert(
              'danger',
              globalConst.securityQuestionsError
            );
          }
        });
    }
  }

  /**
   * Function that gets the answers to given questions and adds it into an array.
   */
  getAnswers() {
    this.securityAnswers = [];

    let counter = 1;
    for (const question of this.securityQuestions) {
      if (this.securityQuestionsForm.get('answer' + counter).value) {
        const securityQuestion: SecurityQuestion = {
          question: question.question,
          answer: this.securityQuestionsForm.get('answer' + counter).value,
          answerChanged: false,
          id: question.id
        };
        counter++;
        this.securityAnswers.push(securityQuestion);
      }
    }
  }

  /**
   * Funtion that send answers to the backend and decided which screen to show according to backend response
   */
  next() {
    this.showLoader = !this.showLoader;
    this.getAnswers();
    const body: VerifySecurityQuestionsRequest = {
      answers: this.securityAnswers
    };
    this.profileSecurityQuestionsService
      .verifySecurityQuestions(this.evacueeProfileId, body)
      .subscribe({
        next: (results) => {
          this.securityQuestionResult = results.numberOfCorrectAnswers;
          this.showLoader = !this.showLoader;

          if (
            this.securityQuestionResult === 0 ||
            (this.securityQuestionResult === 1 && this.defaultScreen === false)
          ) {
            this.incorrectScreen = true;
          } else if (
            this.securityQuestionResult === 1 &&
            this.defaultScreen === true
          ) {
            this.defaultScreen = false;
          } else {
            this.firstTryCorrect = true;
          }

          if (
            this.securityQuestionResult === 3 ||
            (this.securityQuestionResult === 2 && this.firstTryCorrect)
          ) {
            this.correctAnswerFlag = true;
            this.showLoader = true;
            if (this.evacueeSessionService.fileLinkFlag === 'Y') {
              this.evacueeProfileService
                .linkMemberProfile(this.evacueeSessionService.fileLinkMetaData)
                .subscribe({
                  next: (value) => {
                    this.evacueeSessionService.fileLinkStatus = 'S';
                    this.router.navigate([
                      'responder-access/search/essfile-dashboard'
                    ]);
                  },
                  error: (error) => {
                    this.evacueeSessionService.fileLinkStatus = 'E';
                    this.router.navigate([
                      'responder-access/search/essfile-dashboard'
                    ]);
                  }
                });
            } else {
              setTimeout(() => {
                this.router.navigate([
                  'responder-access/search/evacuee-profile-dashboard'
                ]);
              }, 1000);
            }
          }
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.verifySecurityQuestionError
          );
        }
      });
  }

  /**
   * Function that redirects to Search Results page
   */
  back() {
    this.router.navigate([
      this.evacueeSessionService.securityQuestionsOpenedFrom
    ]);
  }

  /**
   * Function that redirects to Evacuation Registration page
   */
  goToEvacRegistration() {
    this.appBaseService.wizardProperties = {
      wizardType: WizardType.NewRegistration,
      lastCompletedStep: null,
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.NewRegistration },
      queryParamsHandling: 'merge'
    });
  }

  private createAnswersForm(): void {
    this.securityQuestionsForm = this.formBuilder.group({
      answer1: ['', [this.customValidation.whitespaceValidator()]],
      answer2: ['', [this.customValidation.whitespaceValidator()]],
      answer3: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
                this.securityQuestionsForm.get('answer1').status === 'VALID' &&
                this.securityQuestionsForm.get('answer2').status === 'VALID',
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ]
    });
  }
}
