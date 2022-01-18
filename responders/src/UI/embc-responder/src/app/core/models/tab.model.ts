export interface TabModel {
  label: string;
  route: string;
  name?: string;
  status?: string;
  next?: string;
  previous?: string;
}

export interface TabStatusManager {
  tabName: string;
  tabUpdateStatus: boolean;
}
