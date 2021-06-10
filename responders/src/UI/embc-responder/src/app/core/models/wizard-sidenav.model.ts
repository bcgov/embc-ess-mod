import * as globalConst from '../../core/services/global-constants';

export class WizardSidenavModel {
  step: string;
  title: string;
  route: string;
  isLocked: boolean;
  incompleteMsg?: string;
  img: SidenavStepImg;
}

export class SidenavStepImg {
  imgSrc: string;
  altSrc: string;
  height: string;
  width: string;
}

export class WizardSidenavModelValues {
  static newRegistrationMenu: Array<WizardSidenavModel> = [
    {
      step: 'STEP 1',
      title: 'Create Evacuee Profile',
      route: '/ess-wizard/create-evacuee-profile',
      isLocked: false,
      incompleteMsg: globalConst.evacueeProfileStepIncompleteMessage,
      img: {
        imgSrc: '/assets/images/wizard/locked-profile.svg',
        altSrc: '/assets/images/wizard/profile.svg',
        height: '26',
        width: '26'
      }
    },
    {
      step: 'STEP 2',
      title: 'Create ESS File',
      route: '/ess-wizard/create-ess-file',
      isLocked: true,
      incompleteMsg: globalConst.essFileStepIncompleteMessage,
      img: {
        imgSrc: '/assets/images/wizard/locked-ess-file.svg',
        altSrc: '/assets/images/wizard/ess-file.svg',
        height: '29',
        width: '28'
      }
    },
    {
      step: 'STEP 3',
      title: 'Add Supports',
      route: '/ess-wizard/add-supports',
      isLocked: true,
      img: {
        imgSrc: '/assets/images/wizard/locked-supports.svg',
        altSrc: '/assets/images/wizard/supports.svg',
        height: '33',
        width: '33'
      }
    },
    {
      step: 'NOTES',
      title: 'Add ESS File Notes',
      route: '/ess-wizard/add-notes',
      isLocked: true,
      img: {
        imgSrc: '/assets/images/wizard/locked-notes.svg',
        altSrc: '/assets/images/wizard/notes.svg',
        height: '42',
        width: '42'
      }
    }
  ];

  static newESSFileMenu: Array<WizardSidenavModel> = [
    {
      step: 'STEP 1',
      title: 'Create ESS File',
      route: '/ess-wizard/create-ess-file',
      isLocked: false,
      incompleteMsg: globalConst.essFileStepIncompleteMessage,
      img: {
        imgSrc: '/assets/images/wizard/locked-ess-file.svg',
        altSrc: '/assets/images/wizard/ess-file.svg',
        height: '29',
        width: '28'
      }
    },
    {
      step: 'STEP 2',
      title: 'Add Supports',
      route: '/ess-wizard/add-supports',
      isLocked: true,
      img: {
        imgSrc: '/assets/images/wizard/locked-supports.svg',
        altSrc: '/assets/images/wizard/supports.svg',
        height: '33',
        width: '33'
      }
    },
    {
      step: 'NOTES',
      title: 'Add ESS File Notes',
      route: '/ess-wizard/add-notes',
      isLocked: true,
      img: {
        imgSrc: '/assets/images/wizard/locked-notes.svg',
        altSrc: '/assets/images/wizard/notes.svg',
        height: '42',
        width: '42'
      }
    }
  ];
}
