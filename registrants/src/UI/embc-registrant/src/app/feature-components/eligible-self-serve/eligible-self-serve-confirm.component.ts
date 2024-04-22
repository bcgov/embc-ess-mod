import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-confirm',
  templateUrl: './eligible-self-serve-confirm.component.html',
  imports: [MatCardModule, MatStepperModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EligibleSelfServeConfirm {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  gotoSelfServeSupport() {
    this.router.navigate(['../support-form'], { relativeTo: this.route });
  }
}
