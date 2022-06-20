import { Injectable } from '@angular/core';
import { ComputeWizardService } from '../core/services/compute/computeWizard.service';

@Injectable({ providedIn: 'root' })
export class MockComputeWizardService extends ComputeWizardService {}
