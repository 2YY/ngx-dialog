import {Component, ElementRef, NgModule, OnDestroy, ViewChild} from '@angular/core';
import {NgxOverlayService} from '../lib/ngx-overlay.service';
import {ComponentPortal, PortalModule} from '@angular/cdk/portal';
import {ConnectedPosition, OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {Meta, moduleMetadata, Story} from '@storybook/angular';
import {animate, animation, style, transition, trigger, useAnimation} from '@angular/animations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//////////////////////////////////////////////////

const fadeIn = animation([
  style({opacity:0}),
  animate('100ms', style({opacity:1}))
]);

const fadeOut = animation([
  animate('100ms', style({opacity:0}))
]);

//////////////////////////////////////////////////

@Component({
  selector: 'lib-overlay-body-example',
  template: '<div><p>Hello World</p></div>',
  styles: [
    `
      div {
        position: relative;
        width: 100px;
        height: 100px;
        background: salmon;
      }
      div p {
        display: inline-block;
        position: absolute;
        white-space: nowrap;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        background: black;
        color: white;
        padding: 2px 4px;
        margin: 0;
      }
    `
  ],
  animations: [
    trigger('insertAndRemove', [
      transition(':enter', useAnimation(fadeIn)),
      transition(':leave', useAnimation(fadeOut))
    ])
  ],
  host: {
    '[@insertAndRemove]': 'null'
  }
})
class OverlayBodyExampleComponent {}

@NgModule({
  declarations: [OverlayBodyExampleComponent],
  exports: [OverlayBodyExampleComponent]
})
class OverlayBodyExampleModule {}

//////////////////////////////////////////////////

@Component({
  selector: 'lib-overlay-example',
  template: `
    <ng-container>
      <p><button #btnDialog (click)="showDialog()">Click Me! (Show Dialog)</button></p>
      <p><button #btnTooltip (mouseenter)="showTooltip()" (mouseleave)="hideTooltip()">Hover Me! (Show Tooltip)</button></p>
    </ng-container>
  `,
  styles: [
    `
      button {
        cursor: pointer;
      }
    `
  ]
})
class OverlayExampleComponent implements OnDestroy {

  @ViewChild('btnTooltip') btnTooltipRef: ElementRef;
  @ViewChild('btnDialog') btnDialogRef: ElementRef;

  overlaySlotIdDialog: string | null = null;
  overlaySlotIdTooltip: string | null = null;
  overlayBodyPortal = new ComponentPortal(OverlayBodyExampleComponent);

  constructor(
    public overlayService: NgxOverlayService,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {}

  ngOnDestroy() {
    // NOTE: Remove unnecessary slots.
    if (this.overlaySlotIdDialog) { this.overlayService.removeOverlaySlot(this.overlaySlotIdDialog); }
    if (this.overlaySlotIdTooltip) { this.overlayService.removeOverlaySlot(this.overlaySlotIdTooltip); }
  }

  showDialog() {
    if (!this.overlaySlotIdDialog) {
      this.createOverlaySlotDialog();
    }

    this.overlayService.show(this.overlayBodyPortal, this.overlaySlotIdDialog);
  }

  hideDialog() {
    if (this.overlaySlotIdDialog && this.overlayService.isShown(this.overlaySlotIdDialog)) {
      this.overlayService.hide(this.overlaySlotIdDialog);
    }
  }

  showTooltip() {
    if (!this.overlaySlotIdTooltip) {
      this.createOverlaySlotTooltip();
    }

    this.overlayService.show(this.overlayBodyPortal, this.overlaySlotIdTooltip);
  }

  hideTooltip() {
    if (this.overlaySlotIdTooltip !== null && this.overlayService.isShown(this.overlaySlotIdTooltip)) {
      this.overlayService.hide(this.overlaySlotIdTooltip);
    }
  }

  private createOverlaySlotDialog() {
    this.overlaySlotIdDialog = this.overlayService.addOverlaySlot({
      hasBackdrop: true,
      width: '62%',
      height: '62%',
      positionStrategy: this.overlayPositionBuilder.global().centerHorizontally().centerVertically(),
      scrollStrategy: this.scrollStrategyOptions.block()
    });
  }

  private createOverlaySlotTooltip() {
    this.overlaySlotIdTooltip = this.overlayService.addOverlaySlot({
      hasBackdrop: false,
      positionStrategy: this.overlayPositionBuilder.flexibleConnectedTo(this.btnTooltipRef).withPositions([{
        offsetX: 0,
        offsetY: 0,
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center'
      } as ConnectedPosition])
    });
  }

}

@NgModule({
  declarations: [OverlayExampleComponent],
  imports: [OverlayBodyExampleModule],
  exports: [OverlayExampleComponent]
})
class OverlayExampleModule {}

//////////////////////////////////////////////////

export default {
  title: 'Examples/Overlay',
  component: OverlayExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, OverlayModule, PortalModule, OverlayExampleModule],
      entryComponents: [OverlayBodyExampleComponent]
    })
  ]
} as Meta;

const Template: Story<OverlayExampleComponent> = (args: OverlayExampleComponent) => ({
  component: OverlayExampleComponent,
  props: args
});

export const Demo = Template.bind({});
Demo.args = {};

