import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-essfile-dashboard',
  templateUrl: './essfile-dashboard.component.html',
  styleUrls: ['./essfile-dashboard.component.scss']
})
export class EssfileDashboardComponent implements OnInit {
  essFile: EvacuationFileModel;

  constructor(
    private essFileService: EssFileService,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEssFile();
  }

  private getEssFile(): void {
    this.essFileService
      .getFileFromId(this.evacueeSessionService.essFileNumber)
      .subscribe((file) => {
        console.log(file);
        this.essFile = file;
      });
  }

  communityName(address: AddressModel): string {
    return (address?.community as Community)?.name;
  }

  /**
   * Open the dialog with definition of
   * profile status
   */
  openStatusDefinition(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: FileStatusDefinitionComponent,
        content: this.essFile.status
      },
      height: '295px',
      width: '580px'
    });
  }

  reviewEssFile(): void {
    // this.cacheService.set(
    //   'wizardOpenedFrom',
    //   '/responder-access/search/evacuee-profile-dashboard'
    // );
    this.evacueeSessionService.setWizardType(WizardType.ReviewFile);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.ReviewFile },
      queryParamsHandling: 'merge'
    });
  }
}
