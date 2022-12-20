import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcheivementsComponent } from './acheivements.component';

describe('AcheivementsComponent', () => {
  let component: AcheivementsComponent;
  let fixture: ComponentFixture<AcheivementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcheivementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcheivementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
