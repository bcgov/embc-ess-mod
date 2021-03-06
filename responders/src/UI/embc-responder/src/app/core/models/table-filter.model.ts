export interface TableFilterModel {
    loadDropdownFilters: DropdownFilterModel[];
    loadInputFilter: InputFilterModel;
}

export interface DropdownFilterModel {
    type: string;
    label: string;
    values: string[];
}

export interface InputFilterModel {
    type: string;
    label: string;
}
