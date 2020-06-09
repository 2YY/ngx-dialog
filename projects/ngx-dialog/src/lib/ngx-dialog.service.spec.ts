import { TestBed } from '@angular/core/testing';

import { NgxDialogService } from './ngx-dialog.service';
import { OverlayModule } from '@angular/cdk/overlay';

describe('NgxDialogService', () => {
  let service: NgxDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule]
    });
    service = TestBed.inject(NgxDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
