import { Injectable } from '@angular/core';
import {Portal} from '@angular/cdk/portal';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';

interface OverlaySlot {
  id: string;
  overlayRef: OverlayRef;
  backdropClickSubscription: Subscription;
  detachmentSubscription: Subscription;
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
    const hide = () => overlayRef.detach();
    const result: OverlaySlot = {
      id: uuid(),
      overlayRef,
      backdropClickSubscription: overlayRef.backdropClick().subscribe(hide),
      detachmentSubscription: overlayRef.detachments().subscribe(hide),
      isShown: false
    };
    this.slots.push(result);
    return result.id;
  }

  removeOverlaySlot(overlaySlotId: string) {
    const slot = this.findSlot(overlaySlotId);
    if (slot) {
      slot.backdropClickSubscription.unsubscribe();
      this.slots = this.slots.filter(v => v !== slot);
    }
  }

  /**
   * Subscribe backdropClick of overlay on slot.
   * @return subscription of backdropClick
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
   * @return subscription of detachment
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
