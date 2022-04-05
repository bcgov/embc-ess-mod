import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  DoCheck,
  Input,
  OnDestroy,
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
export class OverlayLoaderComponent implements OnInit, DoCheck, OnDestroy {
  @Input() showLoader: boolean;
  @ViewChild('loaderRef', { read: TemplateRef, static: true })
  public loaderRef: TemplateRef<any>;
  public color = '#169BD5';
  private overlayRef: OverlayRef;
  constructor(private overlay: Overlay, private vcRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.overlayRef = this.createOverlay();
    this.overlayRef.attach(new TemplatePortal(this.loaderRef, this.vcRef));
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
  }

  /**
   * Sets the overlay configuration
   *
   * @returns reference object
   */
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

  /**
   * Detaches the overlay when the event is consumed
   */
  ngDoCheck(): void {
    if (!this.showLoader && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else if (this.showLoader && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new TemplatePortal(this.loaderRef, this.vcRef));
    }
  }
}
