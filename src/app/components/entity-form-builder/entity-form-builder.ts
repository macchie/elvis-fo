import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { MockData, TableColumnInfo } from '../../services/mock-data';
import { InputText, InputTextModule } from 'primeng/inputtext';
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

export const FieldType = {
  INPUT: { code: 'input', name: 'Text Input' },
  INTEGER: { code: 'integer', name: 'Integer Input' },
  TEXTAREA: { code: 'textarea', name: 'Text Area' },
  SELECT: { code: 'select', name: 'Select Dropdown' },
  CHECKBOX: { code: 'checkbox', name: 'Checkbox' },
  RADIO: { code: 'radio', name: 'Radio Buttons' },
  DATE: { code: 'datepicker', name: 'Date Picker' },
  BELONGS_TO: { code: 'belongs-to', name: 'Relation: Belongs To' },
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
    ButtonGroupModule
  ],
  templateUrl: './entity-form-builder.html',
  styleUrl: './entity-form-builder.css',
})
export class EntityFormBuilder implements OnInit {

  @Input() hostId?: string;

  public _formSpec: any[] = [];
  public _currentFieldIdx: number = -1;

  @ViewChild('editFieldPopover') editFieldPopover!: Popover;
  @ViewChild('contextMenu', { static: false }) contextMenu!: ContextMenu;

  fieldContextMenuItems: any[] = [];

  stateOptions: any[] = [
    { label: '1/3', value: 'col-span-2' },
    { label: '1/2', value: 'col-span-3' },
    { label: '2/3', value: 'col-span-4' },
    { label: 'Full Width', value: 'col-span-6' },
  ];

  fieldList: TableColumnInfo[] = [];
  fieldTypes: { code: string, name: string }[] = [];

  constructor(
    public mockDataSvc: MockData
  ) {
    
  }

  ngOnInit(): void {
    console.log('EntityFormBuilder Host ID:', this.hostId);
    
    if (this.hostId) {
      try {
        this.fieldList = this.mockDataSvc.tableInfo[this.hostId].columns;
        this._formSpec = JSON.parse(JSON.stringify(this.mockDataSvc.tableInfo[this.hostId].formSpec));
      } catch (error) {
        this._formSpec = [];
      }
      console.log(`Table Column Info for Host ID ${this.hostId}:`, this.mockDataSvc.tableInfo[this.hostId]);
    }

    console.log('EntityFormBuilder Fields:', this.fieldList);
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
    this._formSpec.push(_newField);
  }

  onEditField(index: number, event: any) {
    console.log('Edit Field Clicked!', index);
    this._currentFieldIdx = index;
    this._setFieldTypesForField(index);

    if (this._formSpec[index].type === 'belongs-to') {
      this._formSpec[index].props.fromEntity = this.hostId;
      this._formSpec[index].props.fromField = this._formSpec[index].key;
    }

    this.editFieldPopover.show(event);
  }

  onRemoveField(index: number, event: any) {
    console.log('Remove Field Clicked!', index);
    const _spec = this._formSpec[index];
    if (_spec.type !== 'spacer') {
      this._resetField(index);
    } else {
      this._formSpec.splice(index, 1);
    }
  }

  onChangeFieldKey(index: number, event: any) {
    console.log('Field Key Changed:', index, event);
    this._resetField(index);
    this._setFieldTypesForField(index);
    // this._disableUsedFieldSpecs();
  }

  onChangeFieldType(index: number, event: any) {
    console.log('Field Type Changed:', index, event);

    const _field = this._formSpec[index];

    if (_field.type == FieldType.BELONGS_TO.code) {
      // Set default props for belongs-to
      _field.props.fromEntity = this.hostId;
      _field.props.toEntity = '';
      _field.props.fromField = _field.key;
      _field.props.toField = '';
    }
  } 

  async onSave() {
    console.log('Form Spec to Save:', this._formSpec);
    for (const _spec of this._formSpec) {
      if (!_spec.props.label || _spec.props.label.trim() === '') {
        _spec.props.label = _spec.key;
      }
    }
    this.mockDataSvc.onSaveFormDefinition(this.hostId!, this._formSpec);
  }

  // private

  private _getNewField() {
    return {
      key: 'spacer',
      type: 'spacer',
      props: { },
      className: this.stateOptions[this.stateOptions.length - 1].value, // default to Full
    }
  }

  private _addFieldBefore(index: number) {
    console.log('Add Field Before:', index);
    const _newField = this._getNewField();
    this._formSpec.splice(index, 0, _newField);
  }

  private _addFieldAfter(index: number) {
    console.log('Add Field After:', index);
    const _newField = this._getNewField();
    this._formSpec.splice(index + 1, 0, _newField);
  }

  private _disableUsedFieldSpecs() {
    const usedFieldKeys = this._formSpec.map(f => f.key);
    this.fieldList = this.fieldList.map(f => ({
      ...f,
      disabled: usedFieldKeys.includes(f.name),
    }));
  }

  private _setFieldTypesForField(_index: number) {
    if (!this._formSpec || this._formSpec.length === 0 || !this._formSpec[_index]) return;

    try {
      const _columnInfo = this.fieldList.find(f => f.name === this._formSpec[_index].key);
      console.log('Column Info for field:', _columnInfo);
      
      if (!_columnInfo) throw new Error('Column info not found');

      switch (_columnInfo.type) {
        case 'integer':
          this.fieldTypes = [
            FieldType.INTEGER,
            FieldType.BELONGS_TO,
          ];
          if (_columnInfo.foreign_keys && _columnInfo.foreign_keys.length > 0) {
            this._formSpec[_index].type = FieldType.BELONGS_TO.code;
            this._formSpec[_index].props.fromEntity = this.hostId;
            this._formSpec[_index].props.fromField = this._formSpec[_index].key;
          } else {
            this._formSpec[_index].type = FieldType.INTEGER.code;
          }
          break;
        case 'timestamp with time zone':
        case 'timestamp without time zone':
          this.fieldTypes = [
            FieldType.DATE,
            FieldType.INPUT,
          ];
          this._formSpec[_index].type = FieldType.DATE.code;
          break;
        default:
          this.fieldTypes = [
            FieldType.INPUT,
            FieldType.INTEGER,
            FieldType.TEXTAREA,
            FieldType.SELECT,
            FieldType.CHECKBOX,
            FieldType.RADIO,
            FieldType.DATE,
            FieldType.BELONGS_TO,
          ];
          this._formSpec[_index].type = FieldType.INPUT.code;
          break;
      }
    } catch (error) {
      console.log('Error setting field types for field:', error);
    }
  }

  private _resetField(_index: number) {
    if (!this._formSpec || this._formSpec.length === 0 || !this._formSpec[_index]) return;
    this._formSpec[_index].type = 'spacer';
    this._formSpec[_index].props = {};
  }
}
