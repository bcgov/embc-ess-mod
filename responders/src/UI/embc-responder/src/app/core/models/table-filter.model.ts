export interface TableFilterModel {
  loadDropdownFilters: DropdownFilterModel[];
  loadInputFilter?: InputFilterModel;
}

export interface DropdownFilterModel {
  type: string;
  label: ObjectWrapper;
  values: any[];
}

export interface InputFilterModel {
  type: string;
  label: string;
}

export class ObjectWrapper {
  code: string;
  description: string;
}
