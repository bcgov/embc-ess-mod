export interface TabModel {
  label: string;
  route: string;
  name?: string;
  status?: string;
}

export interface TabStatusManager {
  tabName: string;
  tabUpdateStatus: boolean;
}
