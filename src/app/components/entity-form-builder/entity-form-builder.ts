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
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { EntityFormBuilderField } from '../entity-form-builder-field/entity-form-builder-field';


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

  public _formSpec!: any;
  public _currentFieldIdx: number = -1;
  public _currentEditingField: ElvisFormlyFieldConfig | null = null;
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
  fieldTypes: { code: string, name: string }[] = [];

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
    this._formSpec.fields.push(_newField);
    this.formSpecChange.next();
  }

  onEditField(index: number, _fields: FormlyFieldConfig[] = this._formSpec.fields) {
    this._currentFieldIdx = index;
    if (!_fields[index]) {
      _fields[index] = this._getNewField();
    }
    this._currentEditingField = _fields[index];
    this._setFieldTypesForField(index);

    if (_fields[index] && _fields[index].type === 'belongs-to') {
      if (!_fields[index].props) {
        _fields[index].props = {};
      }
      _fields[index].props['fromEntity'] = this.hostId;
      _fields[index].props['fromField'] = _fields[index].key;
    }

    // this.editFieldPopover.show(event);
    // this.editFieldDrawer.show();
    this._showDrawer = true;
  }

  onRemoveField(_field: FormlyFieldConfig, _fields: FormlyFieldConfig[]) {
    _fields = _fields.filter(f => f.id != _field.id);
  }

  onChangeFieldKey(index: number, event: any) {
    console.log('Field Key Changed:', index, event);
    this._resetField(index);
    this._setFieldTypesForField(index);
    // this._disableUsedFieldSpecs();
  }

  onChangeFieldType(index: number, event: any) {
    console.log('Field Type Changed:', index, event);

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
    this.prepareForSave();
    console.log('Saving Form Spec for Entity:', this.hostId, this._formSpec);
    this.mockDataSvc.onSaveFormSpec(this.hostId!, this._formSpec);
    this.mockDataSvc.formSpecs[this.hostId!] = this._formSpec;
    this.formSpecSaved.next();
  }

  prepareForSave(_fields: ElvisFormlyFieldConfig[] = this._formSpec.fields) {
    for (const _fieldSpec of _fields) {
      delete _fieldSpec.id;

      if (_fieldSpec.__builderType === 'layout') {
        delete _fieldSpec['type'];
        _fieldSpec.wrappers = [];

        if (_fieldSpec.__builderWrapper) {
          _fieldSpec.wrappers.push(_fieldSpec.__builderWrapper);
        }
        
        this.prepareForSave(_fieldSpec.fieldGroup);
      }

      if (_fieldSpec.__builderType === 'input') {
        delete _fieldSpec['fieldGroup'];
        delete _fieldSpec['__builderWrapper'];
      }

      if (!_fieldSpec.props!.label || _fieldSpec.props!.label.trim() === '') {
        _fieldSpec.props!.label = _fieldSpec.key as string;
      }

      _fieldSpec.expressions = {};
      
      if (_fieldSpec.__builderRules && _fieldSpec.__builderRules.length > 0) {
        for (const _rule of _fieldSpec.__builderRules) {
          const _expressionKey = _rule.type === 'disabled' ? 'props.disabled' : 'hide';

          _fieldSpec.expressions[_expressionKey] = (_field: FormlyFieldConfig) => {
            if (_rule.condition === 'IS NULL') {
              return _field.form?.get(_rule.field!)?.value ? false : true;
            } else {
              return _field.form?.get(_rule.field!)?.value ? true : false;
            }
          }
        }
      }
    }
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
    console.log('Add Field Before:', index);
    const _newField = this._getNewField();
    this._formSpec.fields.splice(index, 0, _newField);
  }

  private _addFieldAfter(index: number) {
    console.log('Add Field After:', index);
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

  private _setFieldTypesForField(_index: number) {
    if (!this._formSpec || this._formSpec.fields.length === 0 || !this._formSpec.fields[_index]) return;

    try {
      const _columnInfo = this.fieldList.find(f => f.name === this._formSpec.fields[_index].key);
      console.log('Column Info for field:', _columnInfo);
      
      if (!_columnInfo) throw new Error('Column info not found');

      switch (_columnInfo.type) {
        case 'integer':
          this.fieldTypes = [
            FieldType.INTEGER,
            FieldType.BELONGS_TO,
          ];
          if (!this._formSpec.fields[_index].type || this._formSpec.fields[_index].type === 'panel') {
            if (_columnInfo.foreign_keys && _columnInfo.foreign_keys.length > 0) {
              this._formSpec.fields[_index].type = FieldType.BELONGS_TO.code;
              this._formSpec.fields[_index].props!['fromEntity'] = this.hostId;
              this._formSpec.fields[_index].props!['fromField'] = this._formSpec.fields[_index].key;
            } else {
              this._formSpec.fields[_index].type = FieldType.INTEGER.code;
            }
          }
          break;
        case 'boolean':
          this.fieldTypes = [
            FieldType.CHECKBOX,
            FieldType.BELONGS_TO,
          ];
          if (!this._formSpec.fields[_index].type || this._formSpec.fields[_index].type === 'panel') {
            this._formSpec.fields[_index].type = FieldType.CHECKBOX.code;
          }
          break;
        case 'timestamp with time zone':
        case 'timestamp without time zone':
          this.fieldTypes = [
            FieldType.DATE,
            FieldType.INPUT,
          ];
          if (!this._formSpec.fields[_index].type || this._formSpec.fields[_index].type === 'panel') {
            this._formSpec.fields[_index].type = FieldType.DATE.code;
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
          if (!this._formSpec.fields[_index].type || this._formSpec.fields[_index].type === 'panel') {
            this._formSpec.fields[_index].type = FieldType.INPUT.code;
          }
          break;
      }
    } catch (error) {
      console.log('Error setting field types for field:', error);
    }
  }

  private _resetField(_index: number) {
    if (!this._formSpec || this._formSpec.fields.length === 0 || !this._formSpec.fields[_index]) return;
    this._formSpec.fields[_index].__builderType = 'layout';
    this._formSpec.fields[_index].type = 'panel';
    this._formSpec.fields[_index].fieldGroup = [];
    this._formSpec.fields[_index].props = {};
  }
}
