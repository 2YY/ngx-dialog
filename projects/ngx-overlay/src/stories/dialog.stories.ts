import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgxOverlayService} from '../lib/ngx-overlay.service';
import {ComponentPortal, PortalModule} from '@angular/cdk/portal';
import {ConnectedPosition, OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

//////////////////////////////////////////////////

@Component({
  selector: 'lib-overlay-body',
  template: '<p>Hello World</p>',
  styles: ['p {background:white; color:black; padding:30px; border-radius:8px;}']
})
class OverlayBodyExampleComponent {}

@NgModule({
  declarations: [OverlayBodyExampleComponent],
  exports: [OverlayBodyExampleComponent]
})
class OverlayBodyExampleModule {}

//////////////////////////////////////////////////

@Component({
  selector: 'lib-overlay-sandbox',
  template: [
    '<ng-container>',
      '<p><button #btn ',
        '(click)="showOverlay()" ',
        '(mouseenter)="showTooltip()" ',
        '(mouseleave)="hideTooltip()"',
      '>Show Overlay</button></p>',
    '</ng-container>'
  ].join(''),
  styles: ['button {cursor:pointer;}']
})
class OverlaySandboxComponent implements OnDestroy {

  @ViewChild('btn') btnRef: ElementRef;

  overlaySlotFixedCenterId: string;
  overlaySlotTooltipId: string;
  overlayBodyPortal = new ComponentPortal(OverlayBodyExampleComponent);

  constructor(
    public overlayService: NgxOverlayService,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {}

  ngOnDestroy() {
    if (this.overlaySlotFixedCenterId) { this.overlayService.removeOverlaySlot(this.overlaySlotFixedCenterId); }
    if (this.overlaySlotTooltipId) { this.overlayService.removeOverlaySlot(this.overlaySlotTooltipId); }
  }

  showOverlay() {
    this.hideOverlay();

    if (!this.overlaySlotFixedCenterId) {
      this.overlaySlotFixedCenterId = this.overlayService.addOverlaySlot({
        hasBackdrop: true,
        width: '62%',
        height: '62%',
        positionStrategy: this.overlayPositionBuilder.global().centerHorizontally().centerVertically(),
        scrollStrategy: this.scrollStrategyOptions.block()
      });
    }

    this.overlayService.show(this.overlayBodyPortal, this.overlaySlotFixedCenterId);
  }

  hideOverlay() {
    if (this.overlaySlotFixedCenterId && this.overlayService.isShown(this.overlaySlotFixedCenterId)) {
      this.overlayService.hide(this.overlaySlotFixedCenterId);
    }
  }

  showTooltip() {
    this.hideTooltip();

    if (!this.overlaySlotTooltipId) {
      this.overlaySlotTooltipId = this.overlayService.addOverlaySlot({
        hasBackdrop: false,
        positionStrategy: this.overlayPositionBuilder.flexibleConnectedTo(this.btnRef).withPositions([{
          offsetX: 0,
          offsetY: 0,
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top'
        } as ConnectedPosition])
      });
    }

    this.overlayService.show(this.overlayBodyPortal, this.overlaySlotTooltipId);
  }

  hideTooltip() {
    if (this.overlaySlotTooltipId && this.overlayService.isShown(this.overlaySlotTooltipId)) {
      this.overlayService.hide(this.overlaySlotTooltipId);
    }
  }

}

@NgModule({
  declarations: [OverlaySandboxComponent],
  imports: [OverlayBodyExampleModule],
  exports: [OverlaySandboxComponent]
})
class OverlaySandboxModule {}

//////////////////////////////////////////////////

export default {
  title: 'Overlay',
};

export const BasicUsage = () => ({
  component: OverlaySandboxComponent,
  props: {},
  moduleMetadata: {
    imports: [RouterTestingModule, HttpClientModule, OverlayModule, PortalModule, OverlayBodyExampleModule, OverlaySandboxModule],
    entryComponents: [OverlayBodyExampleComponent]
  }
});
