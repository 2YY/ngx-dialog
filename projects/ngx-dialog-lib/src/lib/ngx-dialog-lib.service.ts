import { Injectable } from '@angular/core';
import {OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {Portal} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class NgxDialogLibService {

  overlayRefInstance: OverlayRef;
  backdropClickSubscription: Subscription | null = null;

  set overlayRef(overlayRef: OverlayRef) {
    this.overlayRefInstance = overlayRef;
    if (this.backdropClickSubscription !== null) {
      this.backdropClickSubscription.unsubscribe();
    }
    this.backdropClickSubscription = this.overlayRefInstance.backdropClick().subscribe(this.hide.bind(this));
  }

  get overlayRef() {
    return this.overlayRefInstance;
  }

  show(portal: Portal<any>) {
    this.checkIsOverlayRefExists();
    this.overlayRefInstance.attach(portal);
  }

  hide() {
    this.checkIsOverlayRefExists();
    this.overlayRefInstance.detach();
  }

  private checkIsOverlayRefExists() {
    if (!this._overlayRef) {
      throw Error('[NgxDialogLibService] OverlayRef not registered. Please register by using overlayRef setter.');
    }
  }

}
