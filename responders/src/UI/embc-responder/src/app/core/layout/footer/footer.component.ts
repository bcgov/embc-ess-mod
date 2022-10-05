import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogContent } from '../../models/dialog-content.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(private httpClient: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.appVersion = environment.version;
  }

  openVersionsModal(): void {
    this.httpClient.get('version').subscribe((response) => {
      const content = response as { name: string; version: string }[];
      const dialog = this.dialog.open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: this.versionDialog(content)
        },
        autoFocus: false,
        width: '530px'
      });
    });
  }

  private versionDialog(
    versions: { name: string; version: string }[]
  ): DialogContent {
    const rows = versions
      .map(
        (version) =>
          `<tr><td>${version.name}</td><td>${version.version}</td></tr>`
      )
      .join('');
    return {
      text: `<table class="versions-table">${rows}</table>`,
      cancelButton: 'Close',
      title: 'Version Information'
    };
  }
}
