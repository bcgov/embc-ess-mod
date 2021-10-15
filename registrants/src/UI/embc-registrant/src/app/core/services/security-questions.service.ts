import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/core/api/services';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {
  private securityQuestionOptionsVal: string[];

  constructor(
    private configurationService: ConfigurationService,
    private cacheService: CacheService
  ) {}

  set securityQuestionOptions(securityQuestionOptionsVal: string[]) {
    this.securityQuestionOptionsVal = securityQuestionOptionsVal;
    this.cacheService.set('securityQues', securityQuestionOptionsVal);
  }

  get securityQuestionOptions(): string[] {
    return this.securityQuestionOptionsVal
      ? this.securityQuestionOptionsVal
      : JSON.parse(this.cacheService.get('securityQues'));
  }

  /**
   * Get list of approved Security Questions from API to populate dropdown
   *
   * @returns string[] list of security questions
   */
  getSecurityQuestionList(): void {
    this.configurationService
      .configurationGetSecurityQuestions()
      .subscribe((list) => {
        this.securityQuestionOptions = list;
      });
  }

  public async loadSecurityQuesList(): Promise<void> {
    return this.configurationService
      .configurationGetSecurityQuestions()
      .pipe(
        map((results) => {
          this.securityQuestionOptions = results;
        })
      )
      .toPromise();
  }
}
