import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsRoomPage } from './settings-room.page';

describe('SettingsRoomPage', () => {
  let component: SettingsRoomPage;
  let fixture: ComponentFixture<SettingsRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsRoomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
