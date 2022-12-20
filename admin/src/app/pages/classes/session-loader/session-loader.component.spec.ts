import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLoaderComponent } from './session-loader.component';

describe('SessionLoaderComponent', () => {
  let component: SessionLoaderComponent;
  let fixture: ComponentFixture<SessionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
