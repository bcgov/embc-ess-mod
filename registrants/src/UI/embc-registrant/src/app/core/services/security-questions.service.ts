import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/core/api/services';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';
import * as globalConst from './globalConstants';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {
  private securityQuestionOptionsVal: string[];

  constructor(
    private configurationService: ConfigurationService,
    private cacheService: CacheService,
    private alertService: AlertService
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
    this.configurationService.configurationGetSecurityQuestions().subscribe({
      next: (list) => {
        this.securityQuestionOptions = list;
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.securityQuesError);
      }
    });
  }

  public async loadSecurityQuesList(): Promise<void> {
    return await lastValueFrom(
      this.configurationService.configurationGetSecurityQuestions().pipe(
        map((results) => {
          this.securityQuestionOptions = results;
        })
      )
    );
  }
}
