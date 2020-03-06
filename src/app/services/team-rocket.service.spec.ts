import { TestBed } from '@angular/core/testing';

import { TeamRocketService } from './team-rocket.service';

describe('TeamRocketService', () => {
  let service: TeamRocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamRocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
