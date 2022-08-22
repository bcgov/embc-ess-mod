import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { EssFileService } from 'src/app/core/services/ess-file.service';
import { Community } from 'src/app/core/services/locations.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EssfileDashboardService } from './essfile-dashboard.service';
import * as globalConst from '../../../core/services/global-constants';
import { Note } from 'src/app/core/api/models';
import { map } from 'rxjs/operators';
import { DashboardBanner } from 'src/app/core/models/dialog-content.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { EvacueeSearchService } from '../evacuee-search/evacuee-search.service';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { SelectedPathType } from 'src/app/core/models/appBase.model';

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
  isMinor = false;
  isLinkedToBcsc = false;
  hasPostal = false;
  eligibilityFirstName: string;
  eligibilityLastName: string;
  displayBanner: DashboardBanner;

  constructor(
    private essFileService: EssFileService,
    private router: Router,
    private essfileDashboardService: EssfileDashboardService,
    private alertService: AlertService,
    public appBaseService: AppBaseService,
    private evacueeSearchService: EvacueeSearchService,
    private optionInjectionService: OptionInjectionService
  ) {}

  async ngOnInit(): Promise<void> {
    if (
      this.optionInjectionService.instance.optionType !==
      SelectedPathType.remoteExtensions
    ) {
      this.getEssFile();
    } else {
      this.isLoading = !this.isLoading;
      const $p = await this.optionInjectionService.instance
        .loadEssFile()
        .then(async (file) => {
          const $pp = await this.optionInjectionService.instance
            .loadEvcaueeProfile(file.primaryRegistrantId)
            .then((profile) => {
              this.notesList = this.essfileDashboardService.loadNotes(
                file.notes
              );
              this.essFile = file;
              this.loadDefaultOverviewSection(file);
              this.displayBanner =
                this.optionInjectionService.instance.getDashboardBanner(
                  file?.status
                );
              this.isLoading = !this.isLoading;
            });
        });
    }

    const profile$ = await this.essfileDashboardService.updateMember();

    this.isMinor =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.isMinor;
    this.isLinkedToBcsc =
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.authenticatedUser;
    this.hasPostal = this.essfileDashboardService.hasPostalCode();

    this.essfileDashboardService.showFileLinkingPopups();

    this.eligiblityDisplayName();
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
    this.essfileDashboardService.openStatusDefinition();
  }

  openWizard() {
    const wizardType = this.essfileDashboardService.getWizardType(
      this.optionInjectionService.instance.optionType
    );
    this.isLoading = !this.isLoading;

    this.optionInjectionService.instance
      .openWizard(wizardType)
      .then((value) => {
        this.isLoading = !this.isLoading;
      })
      .catch(() => {
        this.isLoading = !this.isLoading;
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
   * Loads the ESS file for a give file number
   */
  private getEssFile() {
    this.isLoading = !this.isLoading;
    this.essFileService
      .getFileFromId(this.appBaseService?.appModel?.selectedEssFile?.id)
      .pipe(
        map((file: EvacuationFileModel) => {
          this.notesList = this.essfileDashboardService.loadNotes(file.notes);
          this.essFile = file;
          this.essfileDashboardService.essFile = file;
          return file;
        })
      )
      .subscribe({
        next: (essFile: EvacuationFileModel) => {
          this.loadDefaultOverviewSection(essFile);
          this.displayBanner =
            this.optionInjectionService.instance.getDashboardBanner(
              essFile?.status
            );

          this.isLoading = !this.isLoading;
        },
        error: (error) => {
          this.isLoading = !this.isLoading;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.fileDashboardError);
        }
      });
  }

  private eligiblityDisplayName() {
    if (
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== null &&
      this.appBaseService?.appModel?.selectedProfile
        ?.selectedEvacueeInContext !== undefined
    ) {
      this.eligibilityFirstName =
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.personalDetails?.firstName;
      this.eligibilityLastName =
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext?.personalDetails?.lastName;
    } else {
      this.eligibilityFirstName =
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters?.firstName;
      this.eligibilityLastName =
        this.evacueeSearchService?.evacueeSearchContext?.evacueeSearchParameters?.lastName;
    }
  }
}
