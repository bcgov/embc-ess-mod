import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerifySecurityPhraseRequest } from 'src/app/core/api/models';
import { VerifySecurityPhraseResponse } from 'src/app/core/api/models/verify-security-phrase-response';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { EssFileSecurityPhraseService } from './essfile-security-phrase.service';

@Component({
  selector: 'app-essfile-security-phrase',
  templateUrl: './essfile-security-phrase.component.html',
  styleUrls: ['./essfile-security-phrase.component.scss']
})
export class EssfileSecurityPhraseComponent implements OnInit {
  securityPhrase: string;
  givenAnswer: string;
  attemptsRemaning = 3;
  isLoading = false;
  showLoader = false;
  correctAnswerFlag = false;
  wrongAnswerFlag = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    private essFileSecurityPhraseService: EssFileSecurityPhraseService,
    private evacueeSearchService: EvacueeSearchService
  ) {}

  ngOnInit(): void {
    if (this.evacueeSearchService.essFileId === undefined) {
      this.router.navigate(['responder-access/search/evacuee']);
    } else {
      this.essFileSecurityPhraseService
        .getSecurityPhrase(this.evacueeSearchService.essFileId)
        .subscribe((results) => {
          console.log(results);
          // this.securityPhrase = this.profileSecurityQuestionsService.shuffleSecurityQuestions(
          //   results?.questions
          // );
          // this.isLoading = !this.isLoading;
        });
    }
  }

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
    const body: VerifySecurityPhraseRequest = {
      answer: this.givenAnswer
    };

    this.essFileSecurityPhraseService
      .verifySecurityPhrase(this.evacueeSearchService.essFileId, body)
      .subscribe((results) => {
        console.log(results);

        //     this.correctAnswerFlag = true;
        // this.showLoader = true;
        // setTimeout(() => {
        //   this.router.navigate(['responder-access/search/essfile']);
        // }, 1000);
      });
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
