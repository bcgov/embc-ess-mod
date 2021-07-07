export interface TabModel {
  label: string;
  route: string;
  name?: string;
  status?: string;
}

export class WizardTabDefaultValues {
  evacueeProfileTabs: Array<TabModel> = [
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
    {
      label: 'Address',
      route: 'address',
      name: 'address',
      status: 'not-started'
    },
    {
      label: 'Contact',
      route: 'contact',
      name: 'contact',
      status: 'not-started'
    },
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

  essFileTabs: Array<TabModel> = [
    {
      label: 'Evacuation Details',
      route: 'evacuation-details',
      name: 'evacuation-details',
      status: 'not-started'
    },
    {
      label: 'Household Members',
      route: 'household-members',
      name: 'household-members',
      status: 'not-started'
    },
    {
      label: 'Animals',
      route: 'animals',
      name: 'animals',
      status: 'not-started'
    },
    {
      label: 'Needs',
      route: 'needs',
      name: 'needs',
      status: 'not-started'
    },
    {
      label: 'Security Phrase',
      route: 'security-phrase',
      name: 'security-phrase',
      status: 'not-started'
    },
    {
      label: 'Review & Save',
      route: 'review',
      name: 'review',
      status: 'not-started'
    }
  ];

  notesTab: Array<TabModel> = [
    {
      label: 'Notes',
      route: 'notes',
      name: 'notes'
    }
  ];
}
