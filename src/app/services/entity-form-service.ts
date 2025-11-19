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
    console.log(`onAddField(${_key})`);
    _fields.push(this.getNewField());
    this.refreshIDs(_key);
  }

  async onSaveSpec(_key: string, _formSpec: FormSpec) {
    this._prepareForSave(_formSpec.fields);
    console.log('Saving Form Spec for Entity:', _key, _formSpec);
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

  private _generateIDs(_key: string) {
    for (const _field of this.formSpec[_key].fields) {
      _field.id = this._generateID(_key, _field);

      if (_field.fieldGroup && _field.fieldGroup.length > 0) {
        console.log('Generating IDs for layout field group:', _field.fieldGroup);

        for (const _childField of _field.fieldGroup as ElvisFormlyFieldConfig[]) {
          if (_childField.__builderType === 'layout') {
            _childField.id = this._generateID(_key, _childField, _field.__builderWrapper);
          }
        }
      }
    }
  }

  private _generateID(_key: string, _field: ElvisFormlyFieldConfig, _prefix: string = ''): string {
    let _newId = _field.key!.toString();

    if (_field.__builderType === 'layout' && _field.__builderWrapper) {
      _newId = _field.__builderWrapper;
    }

    if (_field.__builderType === 'input') {
      _newId = _newId ? _newId : 'input';
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

    return _newId;
  }

  private _prepareForSave(_fields: ElvisFormlyFieldConfig[]) {
    for (const _fieldSpec of _fields) {
      delete _fieldSpec.id;

      if (_fieldSpec.__builderType === 'layout') {
        delete _fieldSpec['type'];
        _fieldSpec.wrappers = [];

        if (_fieldSpec.__builderWrapper) {
          _fieldSpec.wrappers.push(_fieldSpec.__builderWrapper);
        }
        
        this._prepareForSave(_fieldSpec.fieldGroup as ElvisFormlyFieldConfig[]);
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
