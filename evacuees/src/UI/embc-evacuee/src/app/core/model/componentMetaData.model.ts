import { Observable } from 'rxjs';

export class ComponentMetaDataModel {
  component: Observable<any>;
  nextButtonLabel: string;
  backButtonLabel: string;
  isLast: boolean;
  loadWrapperButton: boolean;
  lastStep: number;
  stepName: string;
}
