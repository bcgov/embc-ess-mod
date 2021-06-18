import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    private evacueeSearchService: EvacueeSearchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.securityAnswers = [];
    this.firstTryCorrect = false;
    // this.isLoading = !this.isLoading;
    this.createAnswersForm();

    if (this.evacueeSearchService.profileId === undefined) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else {
      this.profileSecurityQuestionsService
        .getSecurityQuestions(this.evacueeSearchService.profileId)
        .subscribe((results) => {
          this.securityQuestions = this.profileSecurityQuestionsService.shuffleSecurityQuestions(
            results?.questions
          );
          // this.isLoading = !this.isLoading;
        });
    }
  }

  /**
   * Returns the control of the answer1 from the securityQuestions form
   */
   public get answer1FormControl(): FormControl {
    return this.securityQuestionsForm.get('answer1') as FormControl;
  }

  public get answer2FormControl(): FormControl {
    return this.securityQuestionsForm.get('answer2') as FormControl;
  }

  public get answer3FormControl(): FormControl {
    return this.thirdSecurityQuestionForm.get('answer3') as FormControl;
  }

  /**
   * Function that gets the answers to given questions and adds it into an array.
   */
  getAnswers() {
    
    this.securityAnswers = [];
    let counter = 1;
        for(let question of this.securityQuestions) {
          const securityAQuestion: SecurityQuestion = {
              question: question.question,
              answer: this.securityQuestionsForm.get('answer'+ counter).value,
              answerChanged: false,
              id: question.id
            };
            counter++;
          console.log(securityAQuestion);
          this.securityAnswers.push(securityAQuestion);
        }

    console.log(this.securityAnswers);
  }

  /**
   * Funtion that send answers to the backend and decided which screen to show according to backend response
   */
  next() {
    this.getAnswers();
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
            this.defaultScreen === false)
        ) {
          this.incorrectScreen = true;
        } else if (this.securityQuestionResult === 1 &&
          this.defaultScreen === true) {
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

  private createAnswersForm(): void {
    this.securityQuestionsForm = this.formBuilder.group({
      answer1: [''],
      answer2: [''],
      answer3: ['']
    });
  }
}
