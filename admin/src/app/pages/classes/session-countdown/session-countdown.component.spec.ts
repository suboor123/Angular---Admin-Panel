import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCountdownComponent } from './session-countdown.component';

describe('SessionCountdownComponent', () => {
  let component: SessionCountdownComponent;
  let fixture: ComponentFixture<SessionCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionCountdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
