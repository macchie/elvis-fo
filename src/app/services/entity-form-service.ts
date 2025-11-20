import { Injectable } from '@angular/core';
import { ElvisFormlyFieldConfig, FormSpec } from '../interfaces/form-spec.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MockData } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class EntityFormService {
  
  private _CACHE: { [key: string]: Set<string> } = { };

  public formSpec: { [key: string]: FormSpec; } = {};

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
  
  layoutFieldTypes: { label: string, value: string, disabled?: boolean }[] = [
    { label: 'Panel', value: 'panel' },
    { label: 'Card', value: 'card' },
    { label: 'Tabs', value: 'tabs' },
    { label: 'Accordion', value: 'accordion' },
    // { label: 'Stepper', value: 'stepper', disabled: true },
  ];

  sizeOptions: { label: string, value: string }[] = [
    { label: '1/4', value: 'col-span-3' },
    { label: '1/3', value: 'col-span-4' },
    { label: '1/2', value: 'col-span-6' },
    { label: '2/3', value: 'col-span-8' },
    { label: 'Full Width', value: 'col-span-12' },
  ];

  constructor(
    private mockDataSvc: MockData,
  ) {}

  async init() {
    this.formSpec = {};
    this._CACHE = {};

    const _formSpecs = await this.mockDataSvc.getFormSpecs();

    for (const _spec of _formSpecs) {
      this.formSpec[_spec.host_id] = _spec.data;
      await this.refreshIDs(_spec.host_id);
    }

  }

  getNewField(): ElvisFormlyFieldConfig {
    return {
      __builderType: 'layout',
      __builderWrapper: 'panel',
      key: 'panel',
      type: 'panel',
      props: { },
      fieldGroup: [],
      className: this.sizeOptions[this.sizeOptions.length - 1].value, // default to Full
    }
  }

  refreshIDs(_key: string) {
    this._CACHE[_key] = new Set<string>();
    this._generateIDs(_key);
  }

  onAddField(_key: string, _fields: ElvisFormlyFieldConfig[]) {
    _fields.push(this.getNewField());
    this.refreshIDs(_key);
  }

  onRemoveField(_key: string, _fields: ElvisFormlyFieldConfig[], _field: ElvisFormlyFieldConfig) {
    if (!_fields || !_field) {
      return;
    }

    const fieldIndex = _fields.findIndex((f: any) => f.id === _field.id);
    
    if (fieldIndex !== -1) {
      _fields.splice(fieldIndex, 1);
    }

    this.refreshIDs(_key);
  }

  async onSaveSpec(_key: string) {
    this.refreshIDs(_key);
    const _formSpec = this.formSpec[_key];
    this._prepareForSave(_key, _formSpec.fields);
    this.mockDataSvc.onSaveFormSpec(_key, _formSpec);
    this.formSpec[_key] = _formSpec;
  }

  async getFormSpec(_key: string): Promise<FormSpec> {
    if (this.formSpec[_key]) {
      return this.formSpec[_key];
    }

    let _spec = await this.mockDataSvc.getFormSpec(_key);

    if (_spec.length > 0) {
      this.formSpec[_key] = _spec[0].data;
    } else {
      this.formSpec[_key] = { fields: [] };
    }

    return this.formSpec[_key];
  }

  // private

  private _generateIDs(_key: string, _fields?: ElvisFormlyFieldConfig[], _prefix?: string) {
    if (!_fields && !_prefix) {
      _fields = this.formSpec[_key].fields;
    }

    if (!_fields) {
      return;
    }

    for (const _field of _fields) {
      let _newId = ``;

      if (_field.__builderType === 'layout') {
        _newId = _field.__builderWrapper!;
      }

      if (_field.__builderType === 'input') {
        _newId = _field.key ? _field.key!.toString() : (_field.type ? _field.type!.toString() : 'input');
      }

      if (_prefix && _prefix.trim() !== '') {
        _newId = _prefix + '_' + _newId;
      }

      if (!this._CACHE[_key]) {
        this._CACHE[_key] = new Set<string>();
      }

      if (this._CACHE[_key].has(_newId)) {
        let _suffix = 1;
        while (this._CACHE[_key].has(_newId + '_' + _suffix)) {
          _suffix++;
        }
        _newId = _newId + '_' + _suffix;
      }

      this._CACHE[_key].add(_newId);

      _field.id = _newId;

      if (_field.fieldGroup && _field.fieldGroup.length > 0) {
        this._generateIDs(_key, _field.fieldGroup, _field.id!);
      }
    }
  }

  private _prepareForSave(_key: string, _fields: ElvisFormlyFieldConfig[]) {
    for (const _fieldSpec of _fields) {
      if (_fieldSpec.__builderType === 'layout') {
        _fieldSpec.wrappers = [];

        if (_fieldSpec.__builderWrapper) {
          _fieldSpec.wrappers = [_fieldSpec.__builderWrapper];
        }
      }

      if (_fieldSpec.fieldGroup && _fieldSpec.fieldGroup.length > 0) {
        this._prepareForSave(_key, _fieldSpec.fieldGroup as ElvisFormlyFieldConfig[]);
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

}
