import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RemoteExtOptionService } from '../core/services/compute/remoteExtOption.service';
import { DataService } from '../core/services/helper/data.service';

@Injectable({ providedIn: 'root' })
export class MockRemoteExtService extends RemoteExtOptionService {
  constructor(
    router: Router,
    dataService: DataService,
    builder: UntypedFormBuilder
  ) {
    super(router, dataService, builder);
  }
}
