import { TestBed } from '@angular/core/testing';

import { NgxDialogLibService } from './ngx-dialog-lib.service';

describe('NgxDialogLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxDialogLibService = TestBed.get(NgxDialogLibService);
    expect(service).toBeTruthy();
  });
});
