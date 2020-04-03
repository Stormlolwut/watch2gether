import { TestBed } from '@angular/core/testing';

import { RoomSocketService } from './room-socket.service';

describe('RoomSocketService', () => {
  let service: RoomSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
