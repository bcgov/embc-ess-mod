import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Referral, Support, SupportStatus } from 'src/app/core/api/models';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import { ViewSupportsService } from './view-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReferralCreationService } from '../../step-supports/referral-creation.service';
import { WizardService } from '../../wizard.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LocationsService } from 'src/app/core/services/locations.service';

@Component({
  selector: 'app-view-supports',
  templateUrl: './view-supports.component.html',
  styleUrls: ['./view-supports.component.scss']
})
export class ViewSupportsComponent implements OnInit {
  supportList: Support[];
  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  showLoader = false;
  color = '#169BD5';

  constructor(
    private router: Router,
    public stepSupportsService: StepSupportsService,
    private viewSupportsService: ViewSupportsService,
    private alertService: AlertService,
    private dialog: MatDialog,
    public referralService: ReferralCreationService,
    private wizardService: WizardService,
    private cd: ChangeDetectorRef,
    private evacueeSessionService: EvacueeSessionService,
    private locationsService: LocationsService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state;
        this.enableActionNotification(state);
      }
    }
  }

  ngOnInit(): void {
    this.loadSupportList();
    this.filtersToLoad = this.viewSupportsService.load();
  }

  addSupports() {
    this.router.navigate(['/ess-wizard/add-supports/select-support']);
  }

  process() {
    this.router.navigate(['/ess-wizard/add-supports/review']);
  }

  loadSupportList() {
    this.stepSupportsService
      .getEvacFile(this.evacueeSessionService.essFileNumber)
      .subscribe(
        (file) => {
          this.showLoader = !this.showLoader;
          this.stepSupportsService.currentNeedsAssessment =
            file.needsAssessment;
          const supportModel = [];

          file.supports.forEach((support) => {
            if (
              support.subCategory === 'Lodging_Group' ||
              support.subCategory === 'Lodging_Billeting'
            ) {
              supportModel.push(support);
            } else {
              const value = {
                ...support,
                hostAddress: this.locationsService.getAddressModelFromAddress(
                  (support as Referral).supplierAddress
                )
              };
              supportModel.push(value);
            }
          });
          this.stepSupportsService.evacFile = file;
          this.supportList = supportModel.sort(
            (a, b) => new Date(b.from).valueOf() - new Date(a.from).valueOf()
          );
          this.addDraftSupports();
        },
        (error) => {
          this.showLoader = !this.showLoader;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.supportListerror);
        }
      );
  }

  selected(event: MatSelectChange, filterType: string): void {
    const selectedValue =
      event.value === undefined || event.value === ''
        ? ''
        : event.value.description;
    this.filterTerm = { type: filterType, value: selectedValue };
  }

  openSupportDetails($event: Support): void {
    this.stepSupportsService.selectedSupportDetail = $event;
    this.router.navigate(['/ess-wizard/add-supports/view-detail']);
  }

  addDraftSupports() {
    if (this.referralService.getDraftSupport().length !== 0) {
      this.supportList = [
        ...this.referralService.getDraftSupport(),
        ...this.supportList
      ];
    }
  }

  setStepStatus() {
    const index = this.supportList?.findIndex(
      (support) => support.status === SupportStatus.Draft
    );
    if (index > -1) {
      this.wizardService.setStepStatus('/ess-wizard/ess-file', true);
      this.wizardService.setStepStatus('/ess-wizard/evacuee-profile', true);
      this.cd.detectChanges();
    } else {
      this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
      this.wizardService.setStepStatus('/ess-wizard/evacuee-profile', false);
      this.cd.detectChanges();
    }
  }

  /**
   * Populates action basec notification and open confirmation box
   *
   * @param state navigation state string
   */
  enableActionNotification(state: { [k: string]: any }): void {
    let displayText: DialogContent;
    if (state?.action === 'void') {
      displayText = globalConst.voidMessage;
      setTimeout(() => {
        this.openConfirmation(displayText);
      }, 500);
    } else if (state?.action === 'save') {
      displayText = globalConst.saveMessage;
      setTimeout(() => {
        this.openConfirmation(displayText);
        this.setStepStatus();
      }, 500);
    } else if (state?.action === 'delete') {
      displayText = globalConst.supportDeleteMessage;
      setTimeout(() => {
        this.openConfirmation(displayText);
        this.setStepStatus();
      }, 500);
    } else if (state?.action === 'edit') {
      displayText = globalConst.supportEditMessage;
      setTimeout(() => {
        this.openConfirmation(displayText);
        this.setStepStatus();
      }, 500);
    }
  }

  /**
   * Open confirmation modal window
   *
   * @param text text to display
   */
  openConfirmation(content: DialogContent): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });
  }
}
