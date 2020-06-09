import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgxDialogService} from '../lib/ngx-dialog.service';
import {ComponentPortal, PortalModule} from '@angular/cdk/portal';
import {ConnectedPosition, OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

//////////////////////////////////////////////////

@Component({
  selector: 'lib-dialog-body',
  template: '<p>Hello World</p>',
  styles: ['p {background:white; color:black; padding:30px; border-radius:8px;}']
})
class DialogBodyExampleComponent {}

@NgModule({
  declarations: [DialogBodyExampleComponent],
  exports: [DialogBodyExampleComponent]
})
class DialogBodyExampleModule {}

//////////////////////////////////////////////////

@Component({
  selector: 'lib-dialog-sandbox',
  template: [
    '<ng-container>',
      '<p><button #btn ',
        '(click)="showDialog()" ',
        '(mouseenter)="showTooltip()" ',
        '(mouseleave)="hideTooltip()"',
      '>Show Dialog</button></p>',
    '</ng-container>'
  ].join(''),
  styles: ['button {cursor:pointer;}']
})
class DialogSandboxComponent implements OnDestroy {

  @ViewChild('btn') btnRef: ElementRef;

  dialogSlotFixedCenterId: string;
  dialogSlotTooltipId: string;
  dialogBodyPortal = new ComponentPortal(DialogBodyExampleComponent);

  constructor(
    public dialogService: NgxDialogService,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {}

  ngOnDestroy() {
    if (this.dialogSlotFixedCenterId) { this.dialogService.removeDialogSlot(this.dialogSlotFixedCenterId); }
    if (this.dialogSlotTooltipId) { this.dialogService.removeDialogSlot(this.dialogSlotTooltipId); }
  }

  showDialog() {
    this.hideDialog();

    if (!this.dialogSlotFixedCenterId) {
      this.dialogSlotFixedCenterId = this.dialogService.addDialogSlot({
        hasBackdrop: true,
        width: '62%',
        height: '62%',
        positionStrategy: this.overlayPositionBuilder.global().centerHorizontally().centerVertically(),
        scrollStrategy: this.scrollStrategyOptions.block()
      });
    }

    this.dialogService.show(this.dialogBodyPortal, this.dialogSlotFixedCenterId);
  }

  hideDialog() {
    if (this.dialogSlotFixedCenterId && this.dialogService.isShown(this.dialogSlotFixedCenterId)) {
      this.dialogService.hide(this.dialogSlotFixedCenterId);
    }
  }

  showTooltip() {
    this.hideTooltip();

    if (!this.dialogSlotTooltipId) {
      this.dialogSlotTooltipId = this.dialogService.addDialogSlot({
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

    this.dialogService.show(this.dialogBodyPortal, this.dialogSlotTooltipId);
  }

  hideTooltip() {
    if (this.dialogSlotTooltipId && this.dialogService.isShown(this.dialogSlotTooltipId)) {
      this.dialogService.hide(this.dialogSlotTooltipId);
    }
  }

}

@NgModule({
  declarations: [DialogSandboxComponent],
  imports: [DialogBodyExampleModule],
  exports: [DialogSandboxComponent]
})
class DialogSandboxModule {}

//////////////////////////////////////////////////

export default {
  title: 'Dialog',
};

export const BasicUsage = () => ({
  component: DialogSandboxComponent,
  props: {},
  moduleMetadata: {
    imports: [RouterTestingModule, HttpClientModule, OverlayModule, PortalModule, DialogBodyExampleModule, DialogSandboxModule],
    entryComponents: [DialogBodyExampleComponent]
  }
});
