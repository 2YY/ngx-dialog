import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibNgxDialogComponent } from './lib-ngx-dialog.component';

describe('NgxDialogLibComponent', () => {
  let component: LibNgxDialogComponent;
  let fixture: ComponentFixture<LibNgxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibNgxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibNgxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
