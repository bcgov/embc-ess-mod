import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { EssFileExistsComponent } from 'src/app/shared/components/dialog-components/ess-file-exists/ess-file-exists.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class EvacueeSearchResultsService {
  public isLoadingOverlay: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isLoadingOverlay$: Observable<boolean> =
    this.isLoadingOverlay.asObservable();

  constructor(private dialog: MatDialog) {}

  public setloadingOverlay(isLoading: boolean): void {
    return this.isLoadingOverlay.next(isLoading);
  }

  public getloadingOverlay(): Observable<boolean> {
    return this.isLoadingOverlay$;
  }

  public openEssFileExistsDialog(essFile: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: EssFileExistsComponent,
        content: { title: 'Paper ESS File Already Exists' },
        essFile
      },
      width: '493px'
    });
  }
}
