import { Component, ChangeDetectionStrategy, Type, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { MockData } from '../../../services/mock-data';

interface BelongsToProps extends FormlyFieldProps {
  mode?: 'select' | 'default';
  disabled?: boolean;
  fromEntity?: string;
  toEntity?: string;
  fromField?: string;
  toField?: string;
  displayField?: string;
  onChangeAction?: 'NONE' | 'CLEAR_FIELDS';
  onChangeClearFields?: string;
  dependsOnFields?: string;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<BelongsToProps> {
  type: 'input' | Type<FormlyFieldBelongsTo>;
}

@Component({
  selector: 'formly-field-elvisfo-belongs-to',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './belongs-to.type.scss',
  template: `

    <input
      type="hidden"
      [formControl]="formControl"
      [formlyAttributes]="field"
    />

    @if (props.mode === 'select') {
      <p-floatlabel variant="on">
        <p-select 
          fluid 
          [options]="_selectOptions" 
          [filter]="true" 
          [filterBy]="props.displayField || props.toField" 
          [optionLabel]="props.displayField || props.toField" 
          [optionValue]="props.toField" 
          [formControl]="formControl" 
          [formlyAttributes]="field" 
          [placeholder]="'Select'"
          [disabled]="props.disabled!"
          [showClear]="true"
        />
        <label [for]="id">
          {{ props.label || key }}
          @if (form.enabled && props.required) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </label>
      </p-floatlabel>
    } @else {
      <div class="flex flex-row items-center justify-between gap-2">
        <label [for]="id">
          {{ props.label || key }}
          @if (form.enabled && props.required) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </label>
        <p-buttongroup class="belongs-to flex flex-col basis-full" [style]="{ width: '100% !important' }">
          <p-button (click)="onPreview()" [disabled]="!formControl.value || props.disabled" icon="pi pi-eye" variant="outlined" severity="info"/>
          <p-button fluid (click)="onSelect(); op.toggle($event)" [disabled]="props.disabled" class="grow" [label]="formControl.value || (props.placeholder || 'Select')" variant="outlined" severity="secondary" />
          <p-button (click)="onClear()" [disabled]="!formControl.value || props.disabled" icon="pi pi-times" variant="outlined" severity="danger" />
        </p-buttongroup>
      </div>
    }

    <p-popover #op>
      <div class="flex flex-col gap-4 w-[25rem]"> </div>
    </p-popover>
  `,
})
export class FormlyFieldBelongsTo extends FieldType<FieldTypeConfig<BelongsToProps>> implements OnInit {

  public _displayValue?: string;
  public _helpText?: string;

  public _selectOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private mockDataSvc: MockData
  ) {
    super();
  }

  async ngOnInit() {
    if (this.props.onChangeAction) {
      if (this.props.onChangeAction == 'CLEAR_FIELDS') {
        this.formControl.valueChanges.subscribe(() => {
          // Implement field clearing logic here
          if (this.formControl.dirty) {
            const _keys = this.props.onChangeClearFields || [];
            for (const _key of _keys) {
              console.log('Clearing field due to BELONGS TO change:', _key);
              const _trimmedKey = _key.trim();
              if (_trimmedKey && this.field?.parent?.formControl?.get(_trimmedKey)) {
                this.field.parent.formControl.get(_trimmedKey)?.setValue(null);
              }
            }
          }
        });
      }
    }

    if (this.props.mode === 'select') {
      this._selectOptions = await this.mockDataSvc.getEntities(this.props.toEntity || '')
    }
  }
  
  onPreview() {
    if (this.formControl.value) {
      alert(`${this.props.fromEntity} JOIN ${this.props.toEntity} ON (${this.props.fromEntity}.${this.props.fromField} = ${this.props.toEntity}.${this.props.toField})`)
    } else {
      alert('No item selected to preview.');
    }
  }

  onSelect() {
    this.formControl.markAsDirty();
    this.formControl.patchValue(Math.floor(Math.random() * 1000).toString());
  }

  onClear() {
    this.formControl.markAsDirty();
    this.formControl.patchValue(null);
  }
}
