import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps, } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

@Component({
  selector: 'formly-wrapper-elvisfo-panel-wrapper',
  styleUrl: './panel-wrapper.wrapper.scss',
  template: `
    <div class="flex flex-col gap-2 mt-8">
      <!-- @if (props.label && props.hideLabel !== true) {
        <label [for]="id">
          {{ props.label }}
          @if (form.enabled && props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </label>
      } -->
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
  standalone: false
})
export class FormlyPanelWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
