import { DialogContent } from './dialog-content.model';

export class WizardSidenavModel {
  step: string;
  title: string;
  route: string;
  isLocked: boolean;
  incompleteMsg?: DialogContent;
  img: SidenavStepImg;
}

export class SidenavStepImg {
  imgSrc: string;
  altSrc: string;
  height: string;
  width: string;
}
