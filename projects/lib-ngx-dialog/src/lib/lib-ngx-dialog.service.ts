import { Injectable } from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {Portal} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class LibNgxDialogService {

  private overlayRefInstance: OverlayRef;
  private backdropClickSubscription: Subscription | null = null;
  private isShown = false;

  set overlayRef(overlayRef: OverlayRef) {
    this.overlayRefInstance = overlayRef;
    if (this.backdropClickSubscription !== null) {
      this.backdropClickSubscription.unsubscribe();
    }
    this.backdropClickSubscription = this.overlayRefInstance.backdropClick().subscribe(this.hide.bind(this));
  }

  show(portal: Portal<any>) {
    this.checkIsOverlayRefExists();
    if (!this.isShown) {
      this.overlayRefInstance.attach(portal);
      this.isShown = true;
    }
  }

  hide() {
    this.checkIsOverlayRefExists();
    if (this.isShown) {
      this.overlayRefInstance.detach();
      this.isShown = false;
    }
  }

  private checkIsOverlayRefExists() {
    if (!this.overlayRefInstance) {
      throw Error('[LibNgxDialogService] OverlayRef not registered. Please register by using overlayRef setter.');
    }
  }

}
