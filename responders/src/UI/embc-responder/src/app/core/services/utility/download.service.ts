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

  public printHTML(win: Window, html: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const printWindow = win.document.createElement('iframe');
      printWindow.style.display = 'none';
      win.document.body.appendChild(printWindow);
      setTimeout(() => {
        //wrapping this in a timeout fixes pdf display issues for FF
        printWindow.contentDocument.body.innerHTML = html;
      }, 0);

      //delay to allow browser a chance to load images before showing print screen
      setTimeout(() => {
        //Chrome doesn't save with the iframe title name like it's supposed to, so set the document title to ensure the correct pdf name
        const originalTital = win.document.title;
        const titleMatch = html.match(/<title>(.+)<\/title>/);
        let fileName = win.document.title;
        if (titleMatch) fileName = titleMatch[1];
        win.document.title = fileName;
        printWindow.contentWindow.print();
        win.document.body.removeChild(printWindow);

        win.document.title = originalTital;
        resolve();
      }, 300);
    });
  }
}
