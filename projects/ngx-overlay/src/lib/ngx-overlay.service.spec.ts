import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { NgxOverlayService } from './ngx-overlay.service';
import { OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';

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
export class ExampleComponent implements OnInit {
  @ViewChild('buttonShowOverlay') buttonShowOverlayRef: ElementRef;
  @ViewChild('templateOverlay') templateOverlayRef: TemplateRef<any>;

  private overlaySlotId: string;

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
});
