import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { OptionInjectionService } from '../core/interfaces/searchOptions.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { SearchDataService } from '../core/services/helper/search-data.service';

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
}
