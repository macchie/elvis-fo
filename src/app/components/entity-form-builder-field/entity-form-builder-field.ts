import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';


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
    FieldsetModule
  ],
  templateUrl: './entity-form-builder-field.html',
  styleUrl: './entity-form-builder-field.css',
})
export class EntityFormBuilderField implements OnInit {

  // new 

  @Input() field!: ElvisFormlyFieldConfig | any;
  @Input() fieldGroup: ElvisFormlyFieldConfig[] | any;

  @Input() hostId?: string;
  @Output() formSpecChange: Subject<void> = new Subject<void>();
  @Output() formSpecSaved: Subject<void> = new Subject<void>();

  public _formSpec!: any;
  public _currentFieldIdx: number = -1;
  public _showDrawer: boolean = false;

  @ViewChild('editFieldPopover') editFieldPopover!: Popover;
  @ViewChild('editFieldDrawer') editFieldDrawer!: Drawer;
  @ViewChild('contextMenu', { static: false }) contextMenu!: ContextMenu;

  fieldContextMenuItems: any[] = [];

  sizeOptions: any[] = [
    { label: '1/4', value: 'col-span-3' },
    { label: '1/3', value: 'col-span-4' },
    { label: '1/2', value: 'col-span-6' },
    { label: '2/3', value: 'col-span-8' },
    { label: 'Full Width', value: 'col-span-12' },
  ];

  fieldList: TableColumnInfo[] = [];
  // fieldTypes: { code: string, name: string }[] = [];
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

  ruleTypes: Record<string, string>[] = [
    { label: 'Hidden', value: 'hidden' },
    { label: 'Disabled', value: 'disabled' },
  ];

  ruleConditions: Record<string, string>[] = [
    { label: 'Is Present', value: 'IS NOT NULL' },
    { label: 'Is not Present', value: 'IS NULL' },
    { label: 'IS', value: '=' },
  ];

  builderFieldTypes: Record<string, string>[] = [
    { label: 'Layout Element', value: 'layout' },
    { label: 'Input Element', value: 'input' },
  ];
  
  layoutFieldTypes: Record<string, string>[] = [
    { label: 'Panel', value: 'panel' },
    { label: 'Accordion', value: 'accordion' },
    { label: 'Card', value: 'card' },
    { label: 'Panel', value: 'panel' },
    { label: 'Stepper', value: 'stepper' },
    { label: 'Tabs', value: 'tabs' },
  ];

  constructor(
    public mockDataSvc: MockData
  ) {
    
  }

  ngOnInit(): void {
    if (this.hostId) {
      try {
        this.fieldList = this.mockDataSvc.tableInfo[this.hostId].columns;
        this._formSpec = JSON.parse(JSON.stringify(this.mockDataSvc.formSpecs[this.hostId] || { fields: [] }));
      } catch (error) {
        this._formSpec = { fields: []  };
      }
    }

    this.field.fieldGroup = this.field.fieldGroup || [];
  }

  openContextMenu(event: MouseEvent, _field: any, _index: number): void {
    this.fieldContextMenuItems = [
      { 
        label: 'Add Field Before', 
        icon: 'pi pi-angle-double-left',
        command: (event: any) => {
          this._addFieldBefore(_index);
        }
      },
      { 
        label: 'Add Field After', 
        icon: 'pi pi-angle-double-right' ,
        command: (event: any) => {
          this._addFieldAfter(_index);
        }
      }
    ];

    this.contextMenu.show(event);
    event.stopPropagation();
  }

  onAddField() {
    console.log('Add Field Clicked!');
    const _newField = this._getNewField();
    this.field.fieldGroup.push(_newField);
    this.formSpecChange.next();
  }

  onAddRule() {
    if (!this.field.__builderRules) {
      this.field.__builderRules = [];
    }
    this.field.__builderRules.push({ type: 'hidden' });
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

  onRemoveField() {
    const fieldIndex = this.fieldGroup.findIndex((f: any) => f === this.field);
    if (fieldIndex !== -1) {
      this.fieldGroup.splice(fieldIndex, 1);
    }

    this.formSpecChange.next();
  }

  onRemoveRule(index: number) {
    if (this.field.__builderRules && index >= 0 && index < this.field.__builderRules.length) {
      this.field.__builderRules.splice(index, 1);
    }
  }

  onChangeFieldKey(index: number, event: any) {
    // this._resetField();
    this._setFieldTypesForField();
    // this._disableUsedFieldSpecs();
  }

  onChangeFieldType(index: number, event: any) {
    const _field = this._formSpec.fields[index];

    if (_field.type == FieldType.BELONGS_TO.code) {
      // Set default props for belongs-to
      if (!_field.props) {
        _field.props = {};
      }
      _field.props['fromEntity'] = this.hostId;
      _field.props['toEntity'] = '';
      _field.props['fromField'] = _field.key;
      _field.props['toField'] = '';
      _field.props['displayField'] = '';
    }
  } 

  async onSave() {
    for (const _spec of this._formSpec.fields) {
      if (!_spec.props!.label || _spec.props!.label.trim() === '') {
        _spec.props!.label = _spec.key as string;
      }
      delete _spec['id'];
    }
    this.mockDataSvc.onSaveFormSpec(this.hostId!, this._formSpec);
    this.mockDataSvc.formSpecs[this.hostId!] = this._formSpec;
    this.formSpecSaved.next();
  }

  getProductLabel(product: any): string {
    if (typeof product === 'string') {
        return product;
    }

    return product?.name || '';
  }

  getProductValue(product: any): any {
    console.log('getProductValue called with:', product);

    if (typeof product === 'string') {
      return { name: product, custom: true };
    }
  }

  isDragging: boolean = false;
  _draggingFieldIndex: number = -1;

  onDragStart(event: DragEvent, _field: FormlyFieldConfig, _index: number) {
    console.log('Drag Start for field:', _index, event, _field);
    this._draggingFieldIndex = _index;
    this.isDragging = true;
  }

  onDragEnd(event: DragEvent) {
    console.log('Drag End for field:', event);
    this._draggingFieldIndex = -1;
    this.isDragging = false;
  }

  onDrop(event: DragEvent, _index: number, _endSide: boolean = false) {
    console.log('Drop event:', _index, event);
    if (this._draggingFieldIndex === -1 || this._draggingFieldIndex === _index) {
      this.isDragging = false;
      return;
    }

    const draggedField = this._formSpec.fields[this._draggingFieldIndex];
    // Remove dragged field from its original position
    this._formSpec.fields.splice(this._draggingFieldIndex, 1);
    // Insert dragged field at the new position

    if (_endSide) {
      _index = _index - 1;
    }

    this._formSpec.fields.splice(_index, 0, draggedField);

    this._draggingFieldIndex = -1;

    this.isDragging = false;
  }

  // private

  private _getNewField(): ElvisFormlyFieldConfig {
    return {
      __builderType: 'layout',
      key: 'panel',
      type: 'panel',
      props: { },
      fieldGroup: [],
      className: this.sizeOptions[this.sizeOptions.length - 1].value, // default to Full
    }
  }

  private _addFieldBefore(index: number) {
    const _newField = this._getNewField();
    this._formSpec.fields.splice(index, 0, _newField);
  }

  private _addFieldAfter(index: number) {
    const _newField = this._getNewField();
    this._formSpec.fields.splice(index + 1, 0, _newField);
  }

  private _disableUsedFieldSpecs() {
    const usedFieldKeys = this._formSpec.fields.map((f: any) => f.key);
    this.fieldList = this.fieldList.map(f => ({
      ...f,
      disabled: usedFieldKeys.includes(f.name),
    }));
  }

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

  private _resetField() {
    this.field.__builderType = 'layout';
    this.field.type = 'panel';
    this.field.fieldGroup = [];
    this.field.props = {};
  }
}
