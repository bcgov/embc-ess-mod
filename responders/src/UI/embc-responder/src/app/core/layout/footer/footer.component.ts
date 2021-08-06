import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppVersionDialogComponent } from 'src/app/shared/components/dialog-components/app-version-dialog/app-version-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { VersionInformation } from '../../api/models/version-information';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() appVersion: Array<VersionInformation>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.appVersion = environment.version;
  }

  public openAppVersionDetails(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: AppVersionDialogComponent,
        content: {
          title: 'Application Version'
        },
        versionArray: this.appVersion
      },
      height: '270px',
      width: '450px'
    });
  }
}
