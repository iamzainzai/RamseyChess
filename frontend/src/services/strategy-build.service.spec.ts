import { TestBed } from '@angular/core/testing';

import { StrategyBuildService } from './strategy-build.service';

describe('StrategyBuildService', () => {
  let service: StrategyBuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategyBuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
