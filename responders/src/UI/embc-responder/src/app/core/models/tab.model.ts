export interface TabModel {
  label: string;
  route: string;
  name?: string;
  status?: string;
}

export class WizardTabModelValues {
  static evacueeProfileTabs: Array<TabModel> = [
    {
      label: 'Collection Notice',
      route: 'collection-notice',
      name: 'collection-notice',
      status: 'not-started'
    },
    {
      label: 'Restriction',
      route: 'restriction',
      name: 'restriction',
      status: 'not-started'
    },
    {
      label: 'Evacuee Details',
      route: 'evacuee-details',
      name: 'evacuee-details',
      status: 'incomplete'
    },
    // {
    //   label: 'Address',
    //   route: ''
    // },
    // {
    //   label: 'Contact',
    //   route: ''
    // },
    {
      label: 'Security Questions',
      route: 'security-questions',
      name: 'security-questions',
      status: 'not-started'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started'
    }
  ];

  static essFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'incomplete'
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
      name: 'review',
      status: 'not-started'
    }
  ];
}
