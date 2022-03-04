import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardAdapterService } from './wizard-adapter.service';
import { WizardDataService } from './wizard-data.service';
import { WizardComponent } from './wizard.component';

@Injectable({ providedIn: 'root' })
export class WizardDeactivateGuard implements CanDeactivate<WizardComponent> {
  constructor(
    private cacheService: CacheService,
    private wizardAdapterService: WizardAdapterService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  public canDeactivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //this.wizardAdapterService.clearWizard();
    //this.clearCachedServices();
    return true;
  }
}
