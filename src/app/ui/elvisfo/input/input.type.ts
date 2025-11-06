import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '../form-field/form-field.wrapper';

interface InputProps extends FormlyFieldProps {
  helpText?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  prefixText?: string;
  suffixText?: string;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-elvisfo-input',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './input.type.scss',
  template: `
    <p-inputgroup>
      @if (props.prefixIcon || props.prefixText) {
        <p-inputgroup-addon>
          @if (props.prefixIcon) {
            <i [class]="props.prefixIcon"></i>
          }
          @if (props.prefixText) {
            <span [innerHTML]="props.prefixText"></span>
          }
        </p-inputgroup-addon>
      }

      <input
        pInputText fluid
        [type]="props.type || 'text'"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <!-- @if (props.type !== 'number') {
      } @else {
        <input pInputText fluid type="number" [formControl]="formControl" [formlyAttributes]="field" />
      } -->

      @if (props.suffixIcon || props.suffixText) {
        <p-inputgroup-addon>
          @if (props.suffixIcon) {
            <i [class]="props.suffixIcon"></i>
          }
          @if (props.suffixText) {
            <span [innerHTML]="props.suffixText"></span>
          }
        </p-inputgroup-addon>
      }
    </p-inputgroup>
    
    @if (props.helpText) {
      <small [innerHTML]="props.helpText"></small>
    }
  `,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {

  constructor( ) {
    super();
  }
}
