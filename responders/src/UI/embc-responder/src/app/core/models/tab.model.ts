export interface TabModel {
  label: string;
  route: string;
  name?: string;
  status?: string;
}

export class WizardTabModelValues {

  static notesTab: Array<TabModel> = [
    {
      label: 'Notes',
      route: 'notes',
      name: 'notes'
    }
  ];
}
