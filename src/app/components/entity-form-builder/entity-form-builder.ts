import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MockData, TableColumnInfo } from '../../services/mock-data';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Subject } from 'rxjs';
import { ElvisFormlyFieldConfig, FormSpec } from '../../interfaces/form-spec.interface';
import { DragDropModule } from 'primeng/dragdrop';
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
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
    InputTextModule,
    ContextMenuModule,
    TooltipModule,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    DividerModule,
    SelectButtonModule,
    FloatLabelModule,
    ToggleSwitchModule,
    ButtonGroupModule,
    MultiSelectModule,
    DrawerModule,
    AutoCompleteModule,
    DragDropModule,
    CardModule,
    AccordionModule,
    EntityFormBuilderField
  ],
  templateUrl: './entity-form-builder.html',
  styleUrl: './entity-form-builder.css',
})
export class EntityFormBuilder implements OnInit {

  @Input() hostId?: string;
  @Output() formSpecChange: Subject<void> = new Subject<void>();
  @Output() formSpecSaved: Subject<void> = new Subject<void>();

  @ViewChild('editFieldPopover') editFieldPopover!: Popover;
  @ViewChild('editFieldDrawer') editFieldDrawer!: Drawer;
  @ViewChild('contextMenu', { static: false }) contextMenu!: ContextMenu;

  showDropzones: boolean = false;

  constructor(
    public mockDataSvc: MockData,
    public entityFormSvc: EntityFormService,
    private cd: ChangeDetectorRef
  ) {
    
  }

  async ngOnInit() {
  }

  async onSave() {
    this.entityFormSvc.onSaveSpec(this.hostId!);
  }
}
