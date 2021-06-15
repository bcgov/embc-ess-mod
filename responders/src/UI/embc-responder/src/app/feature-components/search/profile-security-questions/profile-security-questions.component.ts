import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SecurityQuestion,
  VerifySecurityQuestionsRequest
} from 'src/app/core/api/models';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { ProfileSecurityQuestionsService } from './profile-security-questions.service';

@Component({
  selector: 'app-profile-security-questions',
  templateUrl: './profile-security-questions.component.html',
  styleUrls: ['./profile-security-questions.component.scss']
})
export class ProfileSecurityQuestionsComponent implements OnInit {
  securityQuestions: Array<SecurityQuestion> = [];
  securityAnswers: Array<SecurityQuestion>;
  securityQuestionResult: number;
  firstTryCorrect: boolean;
  defaultScreen = true;
  secondTryScreen = false;
  incorrectScreen = false;
  correctAnswerFlag = false;
  showLoader = false;
  isLoading = false;
  color = '#169BD5';

  constructor(
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private router: Router,
    private evacueeSearchService: EvacueeSearchService
  ) {}

  ngOnInit(): void {
    this.securityAnswers = [];
    this.firstTryCorrect = false;
    this.isLoading = !this.isLoading;
    if (this.evacueeSearchService.profileId === undefined) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else {
      this.profileSecurityQuestionsService
        .getSecurityQuestions(this.evacueeSearchService.profileId)
        .subscribe((results) => {
          this.securityQuestions = results?.questions;
          // this.profileSecurityQuestionsService.shuffleSecurityQuestions(
          //   results?.questions
          // );
          this.isLoading = !this.isLoading;
        });
    }
  }

  /**
   * Function that connects to child output. Gets the answer to given questions and adds it into an array.
   * In case the question exists in the array, it replaces the previous answer.
   */
  getAnswers(answer: SecurityQuestion) {
    const index = this.securityAnswers.findIndex(
      (e) => e.question === answer.question
    );

    if (index === -1) {
      this.securityAnswers.push(answer);
    } else {
      this.securityAnswers[index] = answer;
    }

    console.log(this.securityAnswers);
  }

  /**
   * Funtion that send answers to the backend and decided which screen to show according to backend response
   */
  next() {
    const body: VerifySecurityQuestionsRequest = {
      answers: this.securityAnswers
    };
    this.profileSecurityQuestionsService
      .verifySecurityQuestions(this.evacueeSearchService.profileId, body)
      .subscribe((results) => {
        console.log(results.numberOfCorrectAnswers);
        this.securityQuestionResult = results.numberOfCorrectAnswers;

        if (
          this.securityQuestionResult === 0 ||
          (this.securityQuestionResult === 1 &&
            this.securityAnswers.length === 3)
        ) {
          this.incorrectScreen = true;
          this.secondTryScreen = false;
          this.defaultScreen = false;
        } else if (this.securityQuestionResult === 1) {
          this.secondTryScreen = true;
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
          setTimeout(() => {
            this.router.navigate([
              'responder-access/search/evacuee-profile-dashboard'
            ]);
          }, 1000);
        }
      });
  }

  /**
   * Function that redirects to Search Results page
   */
  goToSearchResults() {
    this.router.navigate(['responder-access/search/evacuee']);
  }

  /**
   * Function that redirects to Evacuation Registration page
   */
  goToEvacRegistration() {
    this.router.navigate([
      'ess-wizard/create-evacuee-profile/collection-notice'
    ]);
  }
}
