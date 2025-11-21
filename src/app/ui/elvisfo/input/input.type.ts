import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

interface InputProps extends FormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
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
    <p-floatlabel variant="on">

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

      <label [for]="id" style="z-index: 99;">
        {{ props.label || key }}
        @if (form.enabled && props.required && props.hideRequiredMarker !== true) {
          <span class="text-red-600" aria-hidden="true">*</span>
        }
      </label>
    </p-floatlabel>
    
    @if (props.helpText) {
      <small [innerHTML]="props.helpText"></small>
    }

    @if (showError) {
      <small class="p-error">
        <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
      </small>
    }
  `,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {

  constructor( ) {
    super();
  }
}
