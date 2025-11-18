import { Component, ChangeDetectionStrategy, Type, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

interface BelongsToProps extends FormlyFieldProps {
  disabled?: boolean;
  fromEntity?: string;
  toEntity?: string;
  fromField?: string;
  toField?: string;
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

    <p-buttongroup class="belongs-to flex flex-col basis-full" [style]="{ width: '100% !important' }">
      <p-button (click)="onPreview()" [disabled]="!formControl.value || props.disabled" icon="pi pi-eye" variant="outlined" severity="info"/>
      <p-button fluid (click)="onSelect(); op.toggle($event)" [disabled]="props.disabled" class="grow" [label]="formControl.value || (props.placeholder || 'Select')" variant="outlined" severity="secondary" />
      <p-button (click)="onClear()" [disabled]="!formControl.value || props.disabled" icon="pi pi-times" variant="outlined" severity="danger" />
    </p-buttongroup>

    <p-popover #op>
      <div class="flex flex-col gap-4 w-[25rem]"> </div>
    </p-popover>
  `,
})
export class FormlyFieldBelongsTo extends FieldType<FieldTypeConfig<BelongsToProps>> implements OnInit {

  public _displayValue?: string;
  public _helpText?: string;

  constructor( ) {
    super();
  }

  ngOnInit() {
    if (this.props.fromEntity && this.props.toEntity && this.props.fromField && this.props.toField) {
      this._helpText = `<b>JOIN</b> ${this.props.toEntity} <b>ON</b> (from.${this.props.fromField} = to.${this.props.toField})`;
    } else {
      this._helpText = 'No related entity configured!';
    }

    if (this.props.dependsOnFields && this.props.dependsOnFields.length > 0) {
      for (const _depField of this.props.dependsOnFields) {
        this.field?.parent?.formControl?.get(_depField.trim())?.valueChanges.subscribe((_value: any) => {
          // Implement logic to handle changes in dependent fields
          console.log('Dependent field changed:', _depField);
          // For example, you might want to clear the current value
          if (!_value) {
            this.formControl.patchValue(null);
            this.formControl.disable();
          } else {
            this.formControl.enable();
          }
        });
      }
    }
    
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
