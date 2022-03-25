import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  public downloadFile(win: Window, blob: Blob, fileName: string): void {
    const link = win.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    link.download = fileName;
    win.document.body.appendChild(link);
    link.click();
    win.document.body.removeChild(link);
  }
}
