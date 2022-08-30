import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardType } from '../core/models/wizard-type.model';
import { PaperOptionService } from '../core/services/compute/paperOption.service';
import { DataService } from '../core/services/helper/data.service';

@Injectable({ providedIn: 'root' })
export class MockPaperOptionService extends PaperOptionService {
  constructor(
    router: Router,
    dataService: DataService,
    builder: UntypedFormBuilder
  ) {
    super(router, dataService, builder);
  }
}
