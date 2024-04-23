import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { EligibleSelfServeOptOutDialogComponent } from './eligible-self-serve-opt-out-dialog.component';

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
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  optOutSelfServe() {
    this.dialog
      .open(EligibleSelfServeOptOutDialogComponent, {
        width: '700px'
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.gotoDashboard();
      });
  }

  gotoSelfServeSupport() {
    this.router.navigate(['../support-form'], { relativeTo: this.route });
  }

  gotoDashboard() {
    this.router.navigate(['/verified-registration/dashboard']);
  }
}
