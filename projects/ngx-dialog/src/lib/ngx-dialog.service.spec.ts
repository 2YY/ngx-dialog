import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { NgxDialogService } from './ngx-dialog.service';
import { OverlayModule, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'lib-selector',
  template: `
    <div class="box">
      <button #buttonShowDialog (click)="showDialog()">show dialog</button>
    </div>
    <ng-template #templateDialog>
      <p>this is dialog</p>
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
  @ViewChild('buttonShowDialog') buttonShowDialogRef: ElementRef;
  @ViewChild('templateDialog') templateDialogRef: TemplateRef<any>;

  private dialogSlotId: string;

  constructor(
    private scrollStrategyOptions: ScrollStrategyOptions,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private dialogService: NgxDialogService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.dialogSlotId = this.dialogService.addDialogSlot({
      hasBackdrop: true,
      width: '62%',
      height: '62%',
      positionStrategy: this.overlayPositionBuilder.global().centerHorizontally().centerVertically(),
      scrollStrategy: this.scrollStrategyOptions.close()
    });
  }

  showDialog() {
    const p = new TemplatePortal(this.templateDialogRef, this.viewContainerRef);
    this.dialogService.show(p, this.dialogSlotId);
  }

  hideDialog() {
    this.dialogService.hide(this.dialogSlotId);
  }

  isShownDialog() {
    return this.dialogService.isShown(this.dialogSlotId);
  }

  destroyDialog() {
    this.dialogService.removeDialogSlot(this.dialogSlotId);
  }
}

describe('NgxDialogService', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      imports: [OverlayModule],
      providers: [NgxDialogService]
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

  it('dialog should be shown', () => {
    component.showDialog();
    expect(component.isShownDialog()).toBeTrue();
  });

  it('dialog should be hidden', () => {
    component.hideDialog();
    expect(component.isShownDialog()).toBeFalse();
  });

  it('dialog slot should be deleted', () => {
    component.destroyDialog();
    expect(component.isShownDialog()).toBeNull();
  });
});
