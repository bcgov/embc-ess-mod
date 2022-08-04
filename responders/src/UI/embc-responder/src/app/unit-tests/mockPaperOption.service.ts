import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PaperOptionService } from '../core/services/compute/paperOption.service';
import { DataService } from '../core/services/helper/data.service';

@Injectable({ providedIn: 'root' })
export class MockPaperOptionService extends PaperOptionService {
  constructor(router: Router, dataService: DataService, builder: FormBuilder) {
    super(router, dataService, builder);
  }
}
