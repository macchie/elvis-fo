import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormBuilder } from './entity-form-builder';

describe('EntityFormBuilder', () => {
  let component: EntityFormBuilder;
  let fixture: ComponentFixture<EntityFormBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityFormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
