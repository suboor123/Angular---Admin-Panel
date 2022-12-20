import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcheivementFormComponent } from './add-acheivement-form.component';

describe('AddAcheivementFormComponent', () => {
  let component: AddAcheivementFormComponent;
  let fixture: ComponentFixture<AddAcheivementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAcheivementFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcheivementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
