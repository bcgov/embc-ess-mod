import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { Community } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { FileStatusDefinitionComponent } from 'src/app/shared/components/dialog-components/file-status-definition/file-status-definition.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { EssfileDashboardService } from './essfile-dashboard.service';
import * as globalConst from '../../../core/services/global-constants';
import { Note } from 'src/app/core/api/models';
import { StepNotesService } from '../../wizard/step-notes/step-notes.service';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/core/services/cache.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogContent } from 'src/app/core/models/dialog-content.model';

@Component({
  selector: 'app-essfile-dashboard',
  templateUrl: './essfile-dashboard.component.html',
  styleUrls: ['./essfile-dashboard.component.scss']
})
export class EssfileDashboardComponent implements OnInit {
  essFile: EvacuationFileModel;
  notesList: Array<Note>;
  isLoading = false;
  color = '#169BD5';

  constructor(
    private essFileService: EssFileService,
    private evacueeSessionService: EvacueeSessionService,
    private dialog: MatDialog,
    private router: Router,
    private essfileDashboardService: EssfileDashboardService,
    private alertService: AlertService,
    private stepNotesService: StepNotesService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.getEssFile();
    this.essfileDashboardService.getCategoryList();
    this.essfileDashboardService.getSubCategoryList();
    if (this.evacueeSessionService.fileLinkStatus === 'S') {
      this.openLinkDialog(globalConst.profileLinkMessage)
        .afterClosed()
        .subscribe((value) => {
          this.evacueeSessionService.fileLinkFlag = null;
          this.evacueeSessionService.fileLinkMetaData = null;
          this.evacueeSessionService.fileLinkStatus = null;
        });
    } else if (this.evacueeSessionService.fileLinkStatus === 'E') {
      this.openLinkDialog(globalConst.profileLinkErrorMessage)
        .afterClosed()
        .subscribe((value) => {
          this.evacueeSessionService.fileLinkFlag = null;
          this.evacueeSessionService.fileLinkMetaData = null;
          this.evacueeSessionService.fileLinkStatus = null;
        });
    }
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
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/essfile-dashboard'
    );
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

  /**
   * Navigates the wizard for complete ess file
   */
  completeEssFile(): void {
    this.cacheService.set(
      'wizardOpenedFrom',
      '/responder-access/search/essfile-dashboard'
    );
    this.evacueeSessionService.setWizardType(WizardType.CompleteFile);

    this.router.navigate(['/ess-wizard'], {
      queryParams: { type: WizardType.CompleteFile },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Loads the ESS file for a give file number
   */
  private getEssFile(): void {
    this.isLoading = !this.isLoading;
    this.essFileService
      .getFileFromId(this.evacueeSessionService.essFileNumber)
      .pipe(
        map((file: EvacuationFileModel) => {
          this.loadNotes();
          this.essFile = file;
          this.essfileDashboardService.essFile = file;
          this.evacueeSessionService.profileId = file.primaryRegistrantId;
          return file;
        })
      )
      .subscribe(
        (essFile: EvacuationFileModel) => {
          this.loadDefaultOverviewSection(essFile);
          this.isLoading = !this.isLoading;
        },
        (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.fileDashboardError);
        }
      );
  }

  /**
   * Loads and sorts the notes
   */
  private loadNotes(): void {
    this.stepNotesService.getNotes().subscribe((notes) => {
      const note = notes.sort(
        (a, b) => new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
      );
      this.notesList = note;
    });
  }

  /**
   * Opens link success dialog box
   *
   * @returns mat dialog reference
   */
  private openLinkDialog(displayMessage: DialogContent) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: displayMessage
      },
      width: '530px'
    });
  }
}
