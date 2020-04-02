import { TestBed } from '@angular/core/testing';

import { CanDeactivateRoomGuard } from './can-deactivate-room.guard';

describe('CanDeactivateRoomGuard', () => {
  let guard: CanDeactivateRoomGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateRoomGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
