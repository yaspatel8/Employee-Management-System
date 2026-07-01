import { TestBed } from '@angular/core/testing';

import { LodderService } from './lodder.service';

describe('LodderService', () => {
  let service: LodderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LodderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
