import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DigitalOptionService } from '../core/services/compute/digitalOption.service';
import { DataService } from '../core/services/helper/data.service';

@Injectable({ providedIn: 'root' })
export class MockDigitalOptionService extends DigitalOptionService {
  constructor(
    router: Router,
    dataService: DataService,
    builder: UntypedFormBuilder
  ) {
    super(router, dataService, builder);
  }
}
