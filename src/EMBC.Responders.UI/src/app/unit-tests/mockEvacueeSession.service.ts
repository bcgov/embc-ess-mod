import { Injectable } from '@angular/core';
import { FileLinkRequestModel } from '../core/models/fileLinkRequest.model';
import { EvacueeSessionService } from '../core/services/evacuee-session.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSessionService extends EvacueeSessionService {
  private isPaperBasedValue: boolean;
  private profileIdValue: string;
  private fileLinkStatusValue: string;
  private fileLinkMetaDataValue: FileLinkRequestModel;

  public get isPaperBased(): boolean {
    return this.isPaperBasedValue;
  }
  public set isPaperBased(value: boolean) {
    this.isPaperBasedValue = value;
  }

  public get profileId(): string {
    return this.profileIdValue;
  }
  public set profileId(value: string) {
    this.profileIdValue = value;
  }

  public get fileLinkStatus(): string {
    return this.fileLinkStatusValue;
  }
  public set fileLinkStatus(value: string) {
    this.fileLinkStatusValue = value;
  }

  public get fileLinkMetaData(): FileLinkRequestModel {
    return this.fileLinkMetaDataValue;
  }
  public set fileLinkMetaData(value: FileLinkRequestModel) {
    this.fileLinkMetaDataValue = value;
  }
}
