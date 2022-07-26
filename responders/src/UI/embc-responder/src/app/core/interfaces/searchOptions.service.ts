import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectedPathType } from '../models/appBase.model';
import { EvacueeSearchContextModel } from '../models/evacuee-search-context.model';
import { DigitalOptionService } from '../services/compute/digitalOption.service';
import { PaperOptionService } from '../services/compute/paperOption.service';
import { RemoteExtOptionService } from '../services/compute/remoteExtOption.service';
import { AppBaseService } from '../services/helper/appBase.service';
import { SearchDataService } from '../services/helper/search-data.service';

export interface SearchOptionsService {
  idSearchQuestion: string;
  optionType: SelectedPathType;
  loadDefaultComponent(): void;
  createForm(formType: string): FormGroup;
  search(value: string | EvacueeSearchContextModel, type?: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class OptionInjectionService {
  constructor(
    private appBaseService: AppBaseService,
    private router: Router,
    private searchDataService: SearchDataService,
    private builder: FormBuilder
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
        this.searchDataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.paperBased
    ) {
      return new PaperOptionService(
        this.router,
        this.searchDataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.remoteExtensions
    ) {
      return new RemoteExtOptionService(
        this.router,
        this.searchDataService,
        this.builder
      );
    }
  }
}
