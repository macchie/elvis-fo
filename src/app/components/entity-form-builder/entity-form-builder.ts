import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MockData } from '../../services/mock-data';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Subject } from 'rxjs';
import { EntityFormBuilderField } from '../entity-form-builder-field/entity-form-builder-field';
import { EntityFormService } from '../../services/entity-form-service';


export const FieldType = {
  INPUT: { code: 'input', name: 'Text Input' },
  INTEGER: { code: 'integer', name: 'Integer Input' },
  PASSWORD: { code: 'password', name: 'Password Input' },
  TEXTAREA: { code: 'textarea', name: 'Text Area' },
  SELECT: { code: 'select', name: 'Select Dropdown' },
  CHECKBOX: { code: 'checkbox', name: 'Checkbox' },
  RADIO: { code: 'radio', name: 'Radio Buttons' },
  DATE: { code: 'datepicker', name: 'Date Picker' },
  BELONGS_TO: { code: 'belongs-to', name: 'Relation: Belongs To' },
  HAS_MANY: { code: 'has-many', name: 'Relation: Has Many' },
}

@Component({
  selector: 'app-entity-form-builder',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DrawerModule,
    EntityFormBuilderField
  ],
  templateUrl: './entity-form-builder.html',
  styleUrl: './entity-form-builder.css',
})
export class EntityFormBuilder implements OnInit {

  @Input() hostId?: string;
  @Output() formSpecChange: Subject<void> = new Subject<void>();
  @Output() formSpecSaved: Subject<void> = new Subject<void>();

  @ViewChild('editFieldDrawer') editFieldDrawer!: Drawer;

  showDropzones: boolean = false;

  constructor(
    public mockDataSvc: MockData,
    public entityFormSvc: EntityFormService,
  ) {
    
  }

  async ngOnInit() {
    if (this.hostId) {
      await this.entityFormSvc.initFormSpec(this.hostId);
    }
  }
}
