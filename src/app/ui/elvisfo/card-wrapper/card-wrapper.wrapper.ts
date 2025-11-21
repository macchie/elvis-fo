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
    <p-card class="mt-0" [header]="field.props?.label || undefined">
      <div class="flex flex-col gap-2">
        <ng-container #fieldComponent></ng-container>
      </div>
    </p-card>
  `,
  standalone: false
})
export class FormlyCardWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
