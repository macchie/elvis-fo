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
    <div class="flex flex-col gap-2">
      <ng-container #fieldComponent></ng-container>
    </div>
    <!-- <p-panel [header]="field.props?.label || undefined">
      <ng-container #fieldComponent></ng-container>
    </p-panel> -->
  `,
  standalone: false
})
export class FormlyPanelWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
