import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileSecurityQuestionsService } from './profile-security-questions.service';

export interface SecurityQuestion {
  question: string;
  answerHint: string;
}

export interface SecurityAnswer {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-profile-security-questions',
  templateUrl: './profile-security-questions.component.html',
  styleUrls: ['./profile-security-questions.component.scss']
})
export class ProfileSecurityQuestionsComponent implements OnInit {
  dummyQuestions: SecurityQuestion[] = [
    { question: 'What was the name of your first pet?', answerHint: 'w****n' },
    {
      question: 'In what city or town was your first job?',
      answerHint: 'v*******r'
    },
    {
      question: "What is your oldest sibling's middle name?",
      answerHint: 'c****r'
    }
  ];

  securityQuestions: SecurityQuestion[] = this.profileSecurityQuestionsService.shuffleSecurityQuestions(
    this.dummyQuestions
  );
  securityQuestionResult: number;
  correctAnswerFlag = false;
  showLoader = false;
  securityAnswers: SecurityAnswer[] = [];

  constructor(
    private profileSecurityQuestionsService: ProfileSecurityQuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.securityQuestionResult = 0;
    console.log(this.securityQuestionResult);
  }

  /**
   * Function that connects to child output. Gets the answer to given questions and adds it into an array.
   * In case the question exists in the array, it replaces the previous answer.
   */
  getAnswers(answer: SecurityAnswer) {
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
    this.correctAnswerFlag = true;
    this.showLoader = true;
    setTimeout(() => {
      this.router.navigate(['responder-access/search/evacuee-profile-dashboard']);
    }, 1000);
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
