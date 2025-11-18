import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps, } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

@Component({
  selector: 'formly-wrapper-elvisfo-card-wrapper',
  styleUrl: './card-wrapper.wrapper.scss',
  template: `
    <p-card>
      <div class="flex flex-col gap-2">
      @if (props.label && props.hideLabel !== true) {
        <label [for]="id">
          {{ props.label }}
          @if (form.enabled && props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </label>
      }
      
      <ng-container #fieldComponent></ng-container>

      @if (showError) {
        <small class="p-error">
          <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
        </small>
      }
    </div>
    </p-card>
    <!-- <div class="flex flex-col gap-2">
      @if (props.label && props.hideLabel !== true) {
        <label [for]="id">
          {{ props.label }}
          @if (form.enabled && props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </label>
      }
      
      <ng-container #fieldComponent></ng-container>

      @if (showError) {
        <small class="p-error">
          <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
        </small>
      }
    </div> -->
  `,
  standalone: false
})
export class FormlyCardWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
