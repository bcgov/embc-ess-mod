import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-security-phrase',
  templateUrl: './security-phrase.component.html',
  styleUrls: ['./security-phrase.component.scss']
})
export class SecurityPhraseComponent implements OnInit, OnDestroy {
  tabUpdateSubscription: Subscription;

  constructor(
    private stepCreateEssFileService: StepCreateEssFileService,
    private customValidation: CustomValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createPhraseForm();

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription = this.stepCreateEssFileService.nextTabUpdate.subscribe(
      () => {
        this.updateTabStatus();
      }
    );
  }

  /**
   * Set up main FormGroup with security phrase inputs and validation
   */
  createPhraseForm(): void {
    //put form here
  }

  /**
   * Go to the Review tab if all tabs are complete, otherwise open modal
   */
  next(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();

    if (this.stepCreateEssFileService.checkTabsStatus()) {
      this.stepCreateEssFileService.openModal(
        globalConst.wizardESSFileMessage.text,
        globalConst.wizardESSFileMessage.title
      );
    } else {
      this.router.navigate(['/ess-wizard/create-ess-file/review']);
    }
  }

  /**
   * Go back to the Needs tab
   */
  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/needs']);
  }

  /**
   * Set Security Phrase values in global var, update tab's status indicator
   */
  updateTabStatus() {}

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }
}
