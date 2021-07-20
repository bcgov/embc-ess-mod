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
import { EssfileDashboardService } from './essfile-dashboard.service';

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
    private router: Router,
    private essfileDashboardService: EssfileDashboardService
  ) {}

  ngOnInit(): void {
    this.getEssFile();
  }

  /**
   * Returns community name
   *
   * @param address evacuated from address
   * @returns community name
   */
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

  /**
   * Navigates the wizard for review ess file
   */
  reviewEssFile(): void {
    this.evacueeSessionService.setWizardType(WizardType.ReviewFile);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.ReviewFile },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Loads the default file overview page
   *
   * @param essFile retrieved evacuation file
   */
  loadDefaultOverviewSection(essFile: EvacuationFileModel) {
    this.router.navigate(
      ['/responder-access/search/essfile-dashboard/overview'],
      {
        state: { file: essFile }
      }
    );
  }

  //TODO: Error handling and overlay loader
  private getEssFile(): void {
    this.essFileService
      .getFileFromId(this.evacueeSessionService.essFileNumber)
      .subscribe((file) => {
        this.essFile = file;
        this.essfileDashboardService.essFile = file;
        this.loadDefaultOverviewSection(file);
      });
  }
}
