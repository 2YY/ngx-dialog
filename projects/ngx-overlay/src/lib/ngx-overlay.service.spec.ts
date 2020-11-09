import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { NgxOverlayService } from './ngx-overlay.service';
import { OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lib-selector',
  template: `
    <div class="box">
      <button #buttonShowOverlay (click)="showOverlay()">show overlay</button>
    </div>
    <ng-template #templateOverlay>
      <p>this is overlay</p>
    </ng-template>
  `,
  styles: [`
    .box {
      width: 300px;
      height: 300px;
      background: salmon;
    }
  `]
})
export class ExampleComponent implements OnInit, OnDestroy {
  @ViewChild('buttonShowOverlay') buttonShowOverlayRef: ElementRef;
  @ViewChild('templateOverlay') templateOverlayRef: TemplateRef<any>;

  private overlaySlotId: string;
  private backdropClickSubscription: Subscription | null = null;
  private detachmentSubscription: Subscription | null = null;

  constructor(
    private scrollStrategyOptions: ScrollStrategyOptions,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private overlayService: NgxOverlayService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.overlaySlotId = this.overlayService.addOverlaySlot({
      hasBackdrop: true,
      width: '62%',
      height: '62%',
      positionStrategy: this.overlayPositionBuilder.global().centerHorizontally().centerVertically(),
      scrollStrategy: this.scrollStrategyOptions.close()
    });

    this.backdropClickSubscription = this.overlayService.subscribeBackdropClick(this.overlaySlotId, () => this.onBackdropClick());
    this.detachmentSubscription = this.overlayService.subscribeDetachment(this.overlaySlotId, () => this.onDetachment());
  }

  ngOnDestroy() {
    if (this.detachmentSubscription !== null) {
      this.detachmentSubscription.unsubscribe();
    }
    if (this.backdropClickSubscription !== null) {
      this.backdropClickSubscription.unsubscribe();
    }
  }

  showOverlay() {
    const p = new TemplatePortal(this.templateOverlayRef, this.viewContainerRef);
    this.overlayService.show(p, this.overlaySlotId);
  }

  hideOverlay() {
    this.overlayService.hide(this.overlaySlotId);
  }

  isShownOverlay() {
    return this.overlayService.isShown(this.overlaySlotId);
  }

  destroyOverlay() {
    this.overlayService.removeOverlaySlot(this.overlaySlotId);
  }

  onBackdropClick() {
    // noop
  }

  onDetachment() {
    // noop
  }
}

describe('NgxOverlayService', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      imports: [OverlayModule],
      providers: [NgxOverlayService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('overlay should be shown', () => {
    component.showOverlay();
    expect(component.isShownOverlay()).toBeTrue();
  });

  it('overlay should be hidden', () => {
    component.hideOverlay();
    expect(component.isShownOverlay()).toBeFalse();
  });

  it('overlay slot should be deleted', () => {
    component.destroyOverlay();
    expect(component.isShownOverlay()).toBeNull();
  });

  describe('can remove overlay slot', () => {
    it ('should remove slot if closed overlay of the slot', () => {
      expect(component.isShownOverlay()).toBeFalsy();

      component.destroyOverlay();
      fixture.detectChanges();

      expect(component.isShownOverlay()).toBeFalsy();
    });
    it ('should remove slot if opened overlay of the slot', () => {
      component.showOverlay();
      fixture.detectChanges();
      expect(component.isShownOverlay()).toBeTruthy();

      component.destroyOverlay();
      fixture.detectChanges();

      expect(component.isShownOverlay()).toBeFalsy();
    });
  });

  it('can subscribe backdrop click', () => {
    const spy = spyOn(component, 'onBackdropClick');

    component.showOverlay();
    fixture.detectChanges();

    const elBackdrop = fixture.elementRef.nativeElement.closest('body').querySelector('.cdk-overlay-backdrop');
    expect(elBackdrop).toBeTruthy();

    elBackdrop.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can subscribe detachment', () => {
    const spy = spyOn(component, 'onDetachment');

    component.showOverlay();
    fixture.detectChanges();

    component.hideOverlay();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('can open/close twice (should toggled flags correctly)', () => {
    it('by directly using service method', () => {
      component.showOverlay();
      expect(component.isShownOverlay()).toBeTruthy();

      component.hideOverlay();
      expect(component.isShownOverlay()).toBeFalsy();

      component.showOverlay();
      expect(component.isShownOverlay()).toBeTruthy();

      component.hideOverlay();
      expect(component.isShownOverlay()).toBeFalsy();
    });

    it('close with backdrop clicking', () => {
      const getElBackdrop = () => fixture.elementRef.nativeElement.closest('body').querySelector('.cdk-overlay-backdrop') ;

      component.showOverlay();
      expect(component.isShownOverlay()).toBeTruthy();

      getElBackdrop().click();
      expect(component.isShownOverlay()).toBeFalsy();

      component.showOverlay();
      expect(component.isShownOverlay()).toBeTruthy();

      getElBackdrop().click();
      expect(component.isShownOverlay()).toBeFalsy();
    });
  });
});
