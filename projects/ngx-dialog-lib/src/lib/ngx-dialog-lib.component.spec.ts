import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDialogLibComponent } from './ngx-dialog-lib.component';

describe('NgxDialogLibComponent', () => {
  let component: NgxDialogLibComponent;
  let fixture: ComponentFixture<NgxDialogLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDialogLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDialogLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
