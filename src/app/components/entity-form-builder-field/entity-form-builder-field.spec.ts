import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormBuilderField } from './entity-form-builder-field';

describe('EntityFormBuilderField', () => {
  let component: EntityFormBuilderField;
  let fixture: ComponentFixture<EntityFormBuilderField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormBuilderField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityFormBuilderField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
