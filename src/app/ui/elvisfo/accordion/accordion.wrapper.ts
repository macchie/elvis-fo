import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps, } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

@Component({
  selector: 'formly-wrapper-elvisfo-accordion-wrapper',
  styleUrl: './accordion.wrapper.scss',
  template: `
    <div class="p-4 bg-white rounded-xl">
      <p-accordion>
        @for (field of field.fieldGroup; track $index) {
          <p-accordion-panel [value]="$index">
            <p-accordion-header>{{field.props?.label || field.key}}</p-accordion-header>
            <p-accordion-content>
              <formly-field [field]="field"></formly-field>
            </p-accordion-content>
          </p-accordion-panel>
        }
      </p-accordion>
    </div>
  `,
  standalone: false
})
export class FormlyAccordionWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
