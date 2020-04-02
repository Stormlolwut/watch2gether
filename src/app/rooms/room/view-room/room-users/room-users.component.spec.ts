import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomUsersComponent } from './room-users.component';

describe('RoomUsersComponent', () => {
  let component: RoomUsersComponent;
  let fixture: ComponentFixture<RoomUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomUsersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
