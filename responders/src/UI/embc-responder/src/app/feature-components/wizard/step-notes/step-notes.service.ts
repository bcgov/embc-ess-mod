import { Injectable } from '@angular/core';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';

@Injectable({ providedIn: 'root' })
export class StepNotesService {
  private notesTabVal: Array<TabModel> = WizardTabModelValues.notesTab;

  public get notesTab(): Array<TabModel> {
    return this.notesTabVal;
  }
  public set notesTab(notesTab: Array<TabModel>) {
    this.notesTabVal = notesTab;
  }
}
