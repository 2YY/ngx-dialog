import { Injectable } from '@angular/core';
import {Portal} from '@angular/cdk/portal';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';

interface DialogSlot {
  id: string;
  overlayRef: OverlayRef;
  backdropClickSubscription: Subscription;
  isShown: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NgxDialogService {

  private slots: DialogSlot[] = [];

  constructor(private overlay: Overlay) {}

  /**
   * Add dialog slot.
   * @return ID of created dialog slot
   */
  addDialogSlot(config: OverlayConfig): string {
    const overlayRef = this.overlay.create(config);
    const hide = () => overlayRef.detach();
    const result: DialogSlot = {
      id: uuid(),
      overlayRef,
      backdropClickSubscription: overlayRef.backdropClick().subscribe(hide),
      isShown: false
    };
    this.slots.push(result);
    return result.id;
  }

  removeDialogSlot(dialogSlotId: string) {
    const slot = this.findSlot(dialogSlotId);
    if (slot) {
      slot.backdropClickSubscription.unsubscribe();
      this.slots = this.slots.filter(v => v !== slot);
    }
  }

  /**
   * Subscribe backdropClick of dialog on slot.
   * @return subscription of backdropClick
   */
  subscribeBackdropClick(dialogSlotId: string, callback: () => any): Subscription | null {
    const slot = this.findSlot(dialogSlotId);
    if (slot) {
      return slot.overlayRef.backdropClick().subscribe(callback);
    }
    return null;
  }

  show(portal: Portal<any>, dialogSlotId: string) {
    const slot = this.findSlot(dialogSlotId);
    if (slot && !slot.isShown) {
      slot.overlayRef.attach(portal);
      slot.isShown = true;
    }
  }

  hide(dialogSlotId: string) {
    const slot = this.findSlot(dialogSlotId);
    if (slot && slot.isShown) {
      slot.overlayRef.detach();
      slot.isShown = false;
    }
  }

  /**
   * If exists the slot, return isShown status.
   * Unless, return null.
   */
  isShown(dialogSlotId: string): boolean | null {
    const slot = this.findSlot(dialogSlotId);
    if (slot) {
      return slot.isShown;
    }

    return null;
  }

  private findSlot(dialogSlotId: string) {
    return this.slots.find(v => v.id === dialogSlotId);
  }

}
