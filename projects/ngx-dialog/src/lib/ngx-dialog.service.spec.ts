import { TestBed } from '@angular/core/testing';

import { NgxDialogService } from './ngx-dialog.service';

describe('NgxDialogService', () => {
  let service: NgxDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
