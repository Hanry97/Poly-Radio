import { TestBed } from '@angular/core/testing';

import { RadioListService } from './radio-list.service';

describe('RadioListService', () => {
  let service: RadioListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
