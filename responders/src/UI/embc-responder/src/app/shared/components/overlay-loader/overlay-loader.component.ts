import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  DoCheck,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss']
})
export class OverlayLoaderComponent implements OnInit, DoCheck {
  public color = '#169BD5';
  @Input() showLoader: boolean;

  @ViewChild('loaderRef', { read: TemplateRef, static: true })
  private loaderRef: TemplateRef<any>;
  private overlayRef: OverlayRef;
  constructor(private overlay: Overlay, private vcRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.overlayRef = this.createOverlay();
    this.overlayRef.attach(new TemplatePortal(this.loaderRef, this.vcRef));
  }

  createOverlay(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  ngDoCheck(): void {
    if (!this.showLoader && this.overlayRef.hasAttached) {
      this.overlayRef.detach();
    }
  }
}
