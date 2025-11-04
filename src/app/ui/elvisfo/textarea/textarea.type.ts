import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '../form-field/form-field.wrapper';

interface TextAreaProps extends FormlyFieldProps {}

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  selector: 'formly-field-primeng-textarea',
  template: ` <textarea [formControl]="formControl" [formlyAttributes]="field" pInputTextarea></textarea> `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {}
