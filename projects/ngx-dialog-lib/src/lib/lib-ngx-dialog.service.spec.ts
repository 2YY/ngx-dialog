import { TestBed } from '@angular/core/testing';

import { LibNgxDialogService } from './lib-ngx-dialog.service';

describe('NgxDialogLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibNgxDialogService = TestBed.get(LibNgxDialogService);
    expect(service).toBeTruthy();
  });
});
