import { Injectable } from '@angular/core';
import {Portal} from '@angular/cdk/portal';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';

interface OverlaySlot {
  id: string;
  overlayRef: OverlayRef;
  backdropClickSubscription: Subscription;
  isShown: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NgxOverlayService {

  private slots: OverlaySlot[] = [];

  constructor(private overlay: Overlay) {}

  /**
   * Add overlay slot.
   * @return ID of created overlay slot
   */
  addOverlaySlot(config: OverlayConfig): string {
    const overlayRef = this.overlay.create(config);
    const id = uuid();
    const result: OverlaySlot = {
      id,
      overlayRef,
      backdropClickSubscription: overlayRef.backdropClick().subscribe(() => this.hide(id)),
      isShown: false
    };
    this.slots.push(result);
    return id;
  }

  removeOverlaySlot(overlaySlotId: string) {
    const slot = this.findSlot(overlaySlotId);
    if (slot) {
      // NOTE: Before removing slot, close dialog of the slot if opened.
      if (this.isShown(overlaySlotId)) {
        this.hide(overlaySlotId);
      }

      // NOTE: Remove the slot.
      slot.backdropClickSubscription.unsubscribe();
      this.slots = this.slots.filter(v => v !== slot);
    }
  }

  /**
   * Subscribe backdropClick of overlay on slot.
   * @return subscription of backdropClick (please use to unsubscribe)
   */
  subscribeBackdropClick(overlaySlotId: string, callback: () => any): Subscription | null {
    const slot = this.findSlot(overlaySlotId);
    if (slot) {
      return slot.overlayRef.backdropClick().subscribe(callback);
    }
    return null;
  }

  /**
   * Subscribe detachment of overlay on slot.
   * @return subscription of detachment (please use to unsubscribe)
   */
  subscribeDetachment(overlaySlotId: string, callback: () => any): Subscription | null {
    const slot = this.findSlot(overlaySlotId);
    if (slot) {
      return slot.overlayRef.detachments().subscribe(callback);
    }
    return null;
  }

  show(portal: Portal<any>, overlaySlotId: string) {
    const slot = this.findSlot(overlaySlotId);
    if (slot && !slot.isShown) {
      slot.overlayRef.attach(portal);
      slot.isShown = true;
    }
  }

  hide(overlaySlotId: string) {
    const slot = this.findSlot(overlaySlotId);
    if (slot && slot.isShown) {
      slot.overlayRef.detach();
      slot.isShown = false;
    }
  }

  /**
   * If exists the slot, return isShown status.
   * Unless, return null.
   */
  isShown(overlaySlotId: string): boolean | null {
    const slot = this.findSlot(overlaySlotId);
    if (slot) {
      return slot.isShown;
    }

    return null;
  }

  private findSlot(overlaySlotId: string) {
    return this.slots.find(v => v.id === overlaySlotId);
  }

}
