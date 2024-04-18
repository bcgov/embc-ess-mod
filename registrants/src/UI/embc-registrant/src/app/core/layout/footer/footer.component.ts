import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from '../../components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogContent } from '../../model/dialog-content.model';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MatToolbarModule]
})
export class FooterComponent {
  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) {}

  openVersionsModal(): void {
    this.httpClient.get('version').subscribe((response) => {
      const content = response as { name: string; version: string }[];
      const dialog = this.dialog.open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: this.versionDialog(content)
        },
        height: '345px',
        width: '530px'
      });
    });
  }

  private versionDialog(versions: { name: string; version: string }[]): DialogContent {
    const rows = versions.map((version) => `<tr><td>${version.name}</td><td>${version.version}</td></tr>`).join('');
    return {
      text: `<table class="versions-table">${rows}</table>`,
      cancelButton: 'Close',
      title: 'Version Information'
    };
  }
}
