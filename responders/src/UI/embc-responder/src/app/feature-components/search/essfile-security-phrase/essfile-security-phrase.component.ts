import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-essfile-security-phrase',
  templateUrl: './essfile-security-phrase.component.html',
  styleUrls: ['./essfile-security-phrase.component.scss']
})
export class EssfileSecurityPhraseComponent implements OnInit {
  dummyPhrase = 'j****t';
  givenAnswer: string;

  attemptsRemaning = 3;
  showLoader = false;
  correctAnswerFlag = false;
  wrongAnswerFlag = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Function that connects to child output. Gets the answer to given questions and adds it into an array.
   * In case the question exists in the array, it replaces the previous answer.
   */
  getAnswer(answer: string) {
    this.givenAnswer = answer;
    console.log(this.givenAnswer);
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
    this.correctAnswerFlag = true;
    this.showLoader = true;
    setTimeout(() => {
      this.router.navigate(['responder-access/search/essfile']);
    }, 1000);
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
