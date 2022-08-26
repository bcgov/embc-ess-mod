import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Observable, tap } from 'rxjs';
import { EvacuationFileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EssFilesResultsService {
  public isLoadingOverlay: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isLoadingOverlay$: Observable<boolean> =
    this.isLoadingOverlay.asObservable();
  constructor(
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService,
    private evacueeProfileService: EvacueeProfileService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  public setloadingOverlay(isLoading: boolean): void {
    return this.isLoadingOverlay.next(isLoading);
  }

  public getloadingOverlay(): Observable<boolean> {
    return this.isLoadingOverlay$;
  }

  public async getSearchedUserProfile(
    selectedFile: EvacuationFileSearchResultModel
  ) {
    const searchedMember = selectedFile.householdMembers.find(
      (member) => member.isSearchMatch
    );
    if (
      searchedMember &&
      searchedMember.id !== null &&
      searchedMember.id !== undefined
    ) {
      const profile$ = await this.getEvacueeProfile(searchedMember.id);
    } else {
      this.appBaseService.appModel = {
        selectedProfile: { selectedEvacueeInContext: null }
      };
      this.computeState.triggerEvent();
    }
  }

  public getEvacueeProfile(
    evacueeProfileId: string
  ): Promise<RegistrantProfileModel> {
    const profile$ = this.evacueeProfileService
      .getProfileFromId(evacueeProfileId)
      .pipe(
        tap({
          next: (profile: RegistrantProfileModel) => {},
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.getProfileError);
          }
        })
      );
    return lastValueFrom(profile$);
  }

  public setSelectedFile(fileId: string) {
    this.appBaseService.appModel = {
      selectedEssFile: {
        id: fileId,
        evacuatedFromAddress: null,
        needsAssessment: null,
        primaryRegistrantId: null,
        registrationLocation: null,
        task: null
      }
    };

    this.computeState.triggerEvent();
  }

  public openUnableAccessESSFileDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.disabledESSFileMessage
      },
      width: '520px'
    });
  }

  public openUnableAccessDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content: globalConst.unableAccessFileMessage
      },
      width: '493px'
    });
  }
}
