import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
interface CheckboxProps extends FormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <div class="flex flex-row items-center justify-end">
      <label [for]="id" class="m-0 p-0 mr-4">{{ props.label }}</label>
      <p-toggleswitch [id]="id" [inputId]="id" [formControl]="formControl" [formlyAttributes]="field" />
    </div>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions = { props: { hideLabel: true } };
}
