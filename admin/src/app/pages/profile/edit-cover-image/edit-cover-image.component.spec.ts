import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoverImageComponent } from './edit-cover-image.component';

describe('EditCoverImageComponent', () => {
  let component: EditCoverImageComponent;
  let fixture: ComponentFixture<EditCoverImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCoverImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCoverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
