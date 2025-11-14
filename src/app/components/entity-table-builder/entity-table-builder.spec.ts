import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTableBuilder } from './entity-table-builder';

describe('EntityTableBuilder', () => {
  let component: EntityTableBuilder;
  let fixture: ComponentFixture<EntityTableBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityTableBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityTableBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
