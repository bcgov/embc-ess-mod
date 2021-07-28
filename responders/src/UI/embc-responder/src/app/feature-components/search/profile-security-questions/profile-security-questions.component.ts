import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SecurityQuestion,
  VerifySecurityQuestionsRequest
} from 'src/app/core/api/models';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { ProfileSecurityQuestionsService } from './profile-security-questions.service';

@Component({
  selector: 'app-profile-security-questions',
  templateUrl: './profile-security-questions.component.html',
  styleUrls: ['./profile-security-questions.component.scss']
})
export class ProfileSecurityQuestionsComponent implements OnInit {
  securityQuestionsForm: FormGroup;
  thirdSecurityQuestionForm: FormGroup;
  securityQuestions: Array<SecurityQuestion> = [];
  securityAnswers: Array<SecurityQuestion>;
  securityQuestionResult: number;
  firstTryCorrect: boolean;
  defaultScreen = true;
  incorrectScreen = false;
  correctAnswerFlag = false;
  showLoader = false;
  // isLoading = false;
  color = '#169BD5';

  constructor(
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private router: Router,
    private evacueeSessionService: EvacueeSessionService,
    private formBuilder: FormBuilder,
    private evacueeProfileService: EvacueeProfileService
  ) {}

  ngOnInit(): void {
    // this.isLoading = !this.isLoading;
    this.createAnswersForm();
    this.securityAnswers = [];
    this.firstTryCorrect = false;

    if (this.evacueeSessionService.profileId === undefined) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else {
      this.profileSecurityQuestionsService
        .getSecurityQuestions(this.evacueeSessionService.profileId)
        .subscribe((results) => {
          this.securityQuestions = this.profileSecurityQuestionsService.shuffleSecurityQuestions(
            results?.questions
          );
          // this.isLoading = !this.isLoading;
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
      const securityAQuestion: SecurityQuestion = {
        question: question.question,
        answer: this.securityQuestionsForm.get('answer' + counter).value,
        answerChanged: false,
        id: question.id
      };
      counter++;
      this.securityAnswers.push(securityAQuestion);
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
      .verifySecurityQuestions(this.evacueeSessionService.profileId, body)
      .subscribe((results) => {
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
              .subscribe(
                (value) => {
                  this.evacueeSessionService.fileLinkStatus = 'S';
                  this.router.navigate([
                    'responder-access/search/essfile-dashboard'
                  ]);
                },
                (error) => {
                  this.evacueeSessionService.fileLinkStatus = 'E';
                  this.router.navigate([
                    'responder-access/search/essfile-dashboard'
                  ]);
                }
              );
              
          } else {
            setTimeout(() => {
              this.router.navigate([
                'responder-access/search/evacuee-profile-dashboard'
              ]);
            }, 1000);
          }
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
    this.router.navigate(['ess-wizard/evacuee-profile/collection-notice']);
  }

  private createAnswersForm(): void {
    this.securityQuestionsForm = this.formBuilder.group({
      answer1: [''],
      answer2: [''],
      answer3: ['']
    });
  }
}
