import { TestBed } from '@angular/core/testing';

import { MurfAiService } from './murf-ai.service';

describe('MurfAiService', () => {
  let service: MurfAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MurfAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
