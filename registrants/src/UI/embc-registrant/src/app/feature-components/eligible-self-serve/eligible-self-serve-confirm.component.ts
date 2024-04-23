import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EligibleSelfServeOptOutDialogComponent } from './eligible-self-serve-opt-out-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { InformationDialogComponent } from 'src/app/core/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import * as globalConst from '../../core/services/globalConstants';

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-confirm',
  templateUrl: './eligible-self-serve-confirm.component.html',
  imports: [MatCardModule, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EligibleSelfServeConfirmComponent {
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

  openInteracETransferDialog() {
    this.openInfoDialog(globalConst.interacETransferDialog);
  }

  openInteracOptOutDialog() {
    this.openInfoDialog(globalConst.interacOptOut);
  }

  private openInfoDialog(dialog: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: dialog
      },
      maxWidth: '400px'
    });
  }
}
