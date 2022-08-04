import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  OptionInjectionService,
  SearchOptionsService
} from '../core/interfaces/searchOptions.service';
import { SelectedPathType } from '../core/models/appBase.model';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { SearchDataService } from '../core/services/helper/search-data.service';
import { MockDigitalOptionService } from './mockDigitalOption.service';
import { MockPaperOptionService } from './mockPaperOption.service';
import { MockRemoteExtService } from './mockRemoteExtOption.service';

@Injectable({ providedIn: 'root' })
export class MockOptionInjectionService extends OptionInjectionService {
  constructor(
    appBaseService: AppBaseService,
    router: Router,
    searchDataService: SearchDataService,
    builder: FormBuilder
  ) {
    super(appBaseService, router, searchDataService, builder);
  }

  public get instance(): SearchOptionsService {
    return this.selectTestService();
  }

  private selectTestService() {
    if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.digital
    ) {
      return new MockDigitalOptionService(
        this.router,
        this.dataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.paperBased
    ) {
      return new MockPaperOptionService(
        this.router,
        this.dataService,
        this.builder
      );
    } else if (
      this.appBaseService?.appModel?.selectedUserPathway ===
      SelectedPathType.remoteExtensions
    ) {
      return new MockRemoteExtService(
        this.router,
        this.dataService,
        this.builder
      );
    }
  }
}
