import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrantProfileSearchResultModel } from 'src/app/core/models/evacuee-search-results';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileResultsService {
  public isLoadingOverlay: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isLoadingOverlay$: Observable<boolean> =
    this.isLoadingOverlay.asObservable();

  constructor(
    private dialog: MatDialog,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  public setloadingOverlay(isLoading: boolean): void {
    return this.isLoadingOverlay.next(isLoading);
  }

  public getloadingOverlay(): Observable<boolean> {
    return this.isLoadingOverlay$;
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

  public updateProfile(
    selectedRegistrant: RegistrantProfileSearchResultModel
  ): void {
    const profileIdObject: RegistrantProfileModel = {
      id: selectedRegistrant.id,
      primaryAddress: null,
      mailingAddress: null,
      personalDetails: null,
      contactDetails: null,
      restriction: null
    };
    this.appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: profileIdObject }
    };
    this.computeState.triggerEvent();
  }
}
