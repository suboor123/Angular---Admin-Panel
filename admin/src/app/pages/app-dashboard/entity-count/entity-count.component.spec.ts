import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCountComponent } from './entity-count.component';

describe('EntityCountComponent', () => {
  let component: EntityCountComponent;
  let fixture: ComponentFixture<EntityCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
