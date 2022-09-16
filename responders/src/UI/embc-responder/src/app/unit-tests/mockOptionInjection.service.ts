import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import {
  OptionInjectionService,
  SearchOptionsService
} from '../core/interfaces/searchOptions.service';
import { SelectedPathType } from '../core/models/appBase.model';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { MockDataService } from './mockData.service';
import { MockDigitalOptionService } from './mockDigitalOption.service';
import { MockPaperOptionService } from './mockPaperOption.service';
import { MockRemoteExtService } from './mockRemoteExtOption.service';

@Injectable({ providedIn: 'root' })
export class MockOptionInjectionService {
  constructor(
    public appBaseService: AppBaseService,
    public router: Router,
    public dataService: MockDataService,
    public builder: UntypedFormBuilder
  ) {
    // super(appBaseService, router, dataService, builder);
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
