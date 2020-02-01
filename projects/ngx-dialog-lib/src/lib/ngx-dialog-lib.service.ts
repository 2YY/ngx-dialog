import { Injectable } from '@angular/core';
import {OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {Portal} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class NgxDialogLibService {

  _overlayRef: OverlayRef;
  backdropClickSubscription: Subscription | null = null;

  set overlayRef(overlayRef: OverlayRef) {
    this._overlayRef = overlayRef;
    if (this.backdropClickSubscription !== null) {
      this.backdropClickSubscription.unsubscribe();
    }
    this.backdropClickSubscription = this._overlayRef.backdropClick().subscribe(this.hide.bind(this));
  }

  get overlayRef() {
    return this._overlayRef;
  }

  show(portal: Portal<any>) {
    this.checkIsOverlayRefExists();
    this._overlayRef.attach(portal);
  }

  hide() {
    this.checkIsOverlayRefExists();
    this._overlayRef.detach();
  }

  private checkIsOverlayRefExists() {
    if (!this._overlayRef) {
      throw Error('[NgxDialogLibService] OverlayRef not registered. Please register by using overlayRef setter.');
    }
  }

}
