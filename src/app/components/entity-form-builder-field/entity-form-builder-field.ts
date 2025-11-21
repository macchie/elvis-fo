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
import { ElvisFormlyFieldConfig } from '../../interfaces/form-spec.interface';
import { DragDropModule } from 'primeng/dragdrop';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
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
  selector: 'app-entity-form-builder-field',
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
    TabsModule,
    FieldsetModule,
    ToggleSwitchModule
  ],
  templateUrl: './entity-form-builder-field.html',
  styleUrl: './entity-form-builder-field.css',
})
export class EntityFormBuilderField implements OnInit {

  // new 

  @Input() field!: ElvisFormlyFieldConfig | any;
  // @Input() fieldGroup: ElvisFormlyFieldConfig[] | any;

  @Input() hostId?: string;

  @Input() showDropzones: boolean = false;
  @Output() isDragging: Subject<boolean> = new Subject<boolean>();

  // public _formSpec!: any;
  public _currentFieldIdx: number = -1;
  public _showDrawer: boolean = false;

  @ViewChild('editFieldPopover') editFieldPopover!: Popover;
  @ViewChild('editFieldDrawer') editFieldDrawer!: Drawer;
  @ViewChild('contextMenu', { static: false }) contextMenu!: ContextMenu;

  fieldContextMenuItems: any[] = [];

  fieldList: TableColumnInfo[] = [];

  fieldTypes: { code: string, name: string }[] = [
    FieldType.INPUT,
    FieldType.PASSWORD,
    FieldType.INTEGER,
    FieldType.TEXTAREA,
    FieldType.SELECT,
    FieldType.CHECKBOX,
    FieldType.RADIO,
    FieldType.DATE,
    FieldType.BELONGS_TO,
    FieldType.HAS_MANY,
  ];

  onChangeTypes: Record<string, string>[] = [
    { label: 'Do Nothing', value: 'NONE' },
    { label: 'Clear Fields', value: 'CLEAR_FIELDS' },
  ];

   get _isDragging(): boolean {
    return this.entityFormSvc.isDragSource(this.hostId!, this.field.id);
  }

  // _isDragging: boolean = false;

  constructor(
    public mockDataSvc: MockData,
    public entityFormSvc: EntityFormService,
    private cd: ChangeDetectorRef
  ) {
    
  }

  async ngOnInit() {
    if (this.hostId) {
      try {
        this.fieldList = this.mockDataSvc.tableInfo[this.hostId].columns;
        // this._formSpec = await this.entityFormSvc.getFormSpec(this.hostId);
      } catch (error) {
        // this._formSpec = { fields: []  };
      }
    }

    // this.field.fieldGroup = this.field.fieldGroup || [];
  }

  onAddRule() {
    if (!this.field.__builderRules) {
      this.field.__builderRules = [];
    }
    this.field.__builderRules.push({ type: 'hidden' });
  }

  onAddFilter() {
    if (!this.field.__builderFilters) {
      this.field.__builderFilters = [];
    }
    this.field.__builderFilters.push({ });
  }

  onAddField() {
    this.entityFormSvc.onAddField(this.hostId!, this.field.fieldGroup);
  }

  onEditField() {
    if (this.field && this.field.type === 'belongs-to') {
      if (!this.field.props) {
        this.field.props = {};
      }
      this.field.props['fromEntity'] = this.hostId;
      this.field.props['fromField'] = this.field.key;
    }

    this._showDrawer = true;
  }

  onRemoveRule(index: number) {
    if (this.field.__builderRules && index >= 0 && index < this.field.__builderRules.length) {
      this.field.__builderRules.splice(index, 1);
    }
  }

  onRemoveFilter(index: number) {
    if (this.field.__builderFilters && index >= 0 && index < this.field.__builderFilters.length) {
      this.field.__builderFilters.splice(index, 1);
    }
  }

  onDragStart(event: DragEvent) {
    if (!this.entityFormSvc.dragData[this.hostId!]) {
      console.log('Drag Start for field:', this.field);
      this.entityFormSvc.dragData[this.hostId!] = {
        field: this.field,
        fieldGroup: this.field.parent.fieldGroup,
      };
    }

    this.isDragging.next(true);
  }
  
  onDragEnd(event: DragEvent) {
    if (this.entityFormSvc.dragData[this.hostId!]) {
      console.log('Drag End for field:', this.entityFormSvc.dragData[this.hostId!]);
    }
    delete this.entityFormSvc.dragData[this.hostId!];
    this.isDragging.next(false);
  }

  onDrop(event: DragEvent, _options: { endSide?: boolean } = {}) {
    if (this.entityFormSvc.dragData[this.hostId!]) {
      console.log('Drop on field:', this.field.id, this.field.parent.fieldGroup);

      let _fieldIndex = this.field.parent.fieldGroup.findIndex((f: any) => f.id === this.field.id);
      console.log('Field index in parent fieldGroup:', _fieldIndex);

      if (_options.endSide) {
        // Insert after
        const draggedField = this.entityFormSvc.dragData[this.hostId!].field;
        // Remove dragged field from its original position
        const originalFieldGroup = this.entityFormSvc.dragData[this.hostId!].fieldGroup;
        const originalIndex = originalFieldGroup.findIndex((f: any) => f.id === draggedField.id);

        // handle same field group drop to avoid index shift
        if (originalFieldGroup === this.field.parent.fieldGroup && originalIndex < _fieldIndex) {
          _fieldIndex--;
        }

        if (originalIndex !== -1) {
          originalFieldGroup.splice(originalIndex, 1);
        }

        // Insert dragged field at the new position
        this.field.parent.fieldGroup.splice(_fieldIndex + 1, 0, draggedField);
      } else {
        // Insert before
        const draggedField = this.entityFormSvc.dragData[this.hostId!].field;
        // Remove dragged field from its original position
        const originalFieldGroup = this.entityFormSvc.dragData[this.hostId!].fieldGroup;
        const originalIndex = originalFieldGroup.findIndex((f: any) => f.id === draggedField.id);

        // handle same field group drop to avoid index shift
        if (originalFieldGroup === this.field.parent.fieldGroup && originalIndex < _fieldIndex) {
          _fieldIndex--;
        }
        
        if (originalIndex !== -1) {
          originalFieldGroup.splice(originalIndex, 1);
        }
        
        // Insert dragged field at the new position
        this.field.parent.fieldGroup.splice(_fieldIndex, 0, draggedField);
      }

      delete this.entityFormSvc.dragData[this.hostId!];
      this.entityFormSvc.refreshIDs(this.hostId!);
    }
    
    this.isDragging.next(false);
  }

  // private

  // private _addFieldBefore(index: number) {
  //   const _newField = this.entityFormSvc.getNewField();
  //   this._formSpec.fields.splice(index, 0, _newField);
  // }

  // private _addFieldAfter(index: number) {
  //   const _newField = this.entityFormSvc.getNewField();
  //   this._formSpec.fields.splice(index + 1, 0, _newField);
  // }

  // private _disableUsedFieldSpecs() {
  //   const usedFieldKeys = this._formSpec.fields.map((f: any) => f.key);
  //   this.fieldList = this.fieldList.map(f => ({
  //     ...f,
  //     disabled: usedFieldKeys.includes(f.name),
  //   }));
  // }

  private _setFieldTypesForField() {

    try {
      const _columnInfo = this.fieldList.find(f => f.name === this.field.key);
      
      if (!_columnInfo) throw new Error('Column info not found');

      switch (_columnInfo.type) {
        case 'integer':
          this.fieldTypes = [
            FieldType.INTEGER,
            FieldType.BELONGS_TO,
          ];
          if (!this.field.type || this.field.type === 'panel') {
            if (_columnInfo.foreign_keys && _columnInfo.foreign_keys.length > 0) {
              this.field.type = FieldType.BELONGS_TO.code;
              this.field.props!['fromEntity'] = this.hostId;
              this.field.props!['fromField'] = this.field.key;
            } else {
              this.field.type = FieldType.INTEGER.code;
            }
          }
          break;
        case 'boolean':
          this.fieldTypes = [
            FieldType.CHECKBOX,
            FieldType.BELONGS_TO,
          ];
          if (!this.field.type || this.field.type === 'panel') {
            this.field.type = FieldType.CHECKBOX.code;
          }
          break;
        case 'timestamp with time zone':
        case 'timestamp without time zone':
          this.fieldTypes = [
            FieldType.DATE,
            FieldType.INPUT,
          ];
          if (!this.field.type || this.field.type === 'panel') {
            this.field.type = FieldType.DATE.code;
          }
          break;
        default:
          this.fieldTypes = [
            FieldType.INPUT,
            FieldType.PASSWORD,
            FieldType.INTEGER,
            FieldType.TEXTAREA,
            FieldType.SELECT,
            FieldType.CHECKBOX,
            FieldType.RADIO,
            FieldType.DATE,
            FieldType.BELONGS_TO,
            FieldType.HAS_MANY,
          ];
          if (!this.field.type || this.field.type === 'panel') {
            this.field.type = FieldType.INPUT.code;
          }
          break;
      }
    } catch (error) {
      console.log('Error setting field types for field:', error);
    }
  }
}
