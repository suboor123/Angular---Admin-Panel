import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachSessionFileComponent } from './attach-session-file.component';

describe('AttachSessionFileComponent', () => {
  let component: AttachSessionFileComponent;
  let fixture: ComponentFixture<AttachSessionFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachSessionFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachSessionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
