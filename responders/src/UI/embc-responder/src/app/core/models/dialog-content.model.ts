export interface DialogContent {
  title?: null | string;
  subtitle?: null | string;
  text: null | string;
  confirmButton?: null | string;
  cancelButton?: null | string;
  exitLink?: null | string;
}

export interface DashboardBanner {
  heading: string;
  content: string;
  buttonText?: string;
}
