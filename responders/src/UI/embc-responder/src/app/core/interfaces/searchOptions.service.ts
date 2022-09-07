import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectedPathType } from '../models/appBase.model';
import { DashboardBanner } from '../models/dialog-content.model';
import { EvacuationFileModel } from '../models/evacuation-file.model';
import { EvacueeSearchContextModel } from '../models/evacuee-search-context.model';
import { EvacueeSearchResults } from '../models/evacuee-search-results';
import { RegistrantProfileModel } from '../models/registrant-profile.model';
import { CaseNotesOptionService } from '../services/compute/caseNotesOption.service';
import { DigitalOptionService } from '../services/compute/digitalOption.service';
import { PaperOptionService } from '../services/compute/paperOption.service';
import { RemoteExtOptionService } from '../services/compute/remoteExtOption.service';
import { AppBaseService } from '../services/helper/appBase.service';
import { DataService } from '../services/helper/data.service';
import { UserService } from '../services/user.service';

export interface SearchOptionsService {
  idSearchQuestion: string;
  optionType: SelectedPathType;
  loadDefaultComponent(): void;
  createForm(formType: string): UntypedFormGroup;
  search(
    value: string | EvacueeSearchContextModel,
    type?: string
  ): Promise<boolean | void | EvacueeSearchResults> | void;
  getDashboardBanner(fileStatus: string): DashboardBanner;
  loadEssFile(): Promise<EvacuationFileModel>;
  loadEvcaueeProfile(registrantId: string): Promise<RegistrantProfileModel>;
  openWizard(wizardType: string): Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class OptionInjectionService {
  constructor(
    protected appBaseService: AppBaseService,
    protected router: Router,
    protected dataService: DataService,
    protected builder: UntypedFormBuilder,
    protected userService: UserService
  ) {}

  public get instance(): SearchOptionsService {
    return this.selectService();
  }

  private selectService() {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.digital
    ) {
      return new DigitalOptionService(
        this.router,
        this.dataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.paperBased
    ) {
      return new PaperOptionService(
        this.router,
        this.dataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.remoteExtensions
    ) {
      return new RemoteExtOptionService(
        this.router,
        this.dataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.caseNotes
    ) {
      return new CaseNotesOptionService(
        this.router,
        this.dataService,
        this.builder,
        this.userService
      );
    }
  }
}
