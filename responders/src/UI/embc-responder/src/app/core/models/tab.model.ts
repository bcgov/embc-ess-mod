export interface TabModel {
  label: string;
  route: string;
  status?: string;
}

export class WizardTabModelValues {
  static evacueeProfileTabs: Array<TabModel> = [
    {
      label: 'Collection Notice',
      route: 'collection-notice',
      status: 'not-started'
    },
    {
      label: 'Restriction',
      route: 'restriction',
      status: 'not-started'
    },
    // {
    //   label: 'Evacuee Details',
    //   route: ''
    // },
    // {
    //   label: 'Address',
    //   route: ''
    // },
    // {
    //   label: 'Contact',
    //   route: ''
    // },
    // {
    //   label: 'Security Questions',
    //   route: ''
    // },
    {
      label: 'Review & Save',
      route: 'review',
      status: 'not-started'
    }
  ];
}
