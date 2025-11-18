import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps, } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

@Component({
  selector: 'formly-wrapper-elvisfo-accordion-tab-wrapper',
  styleUrl: './accordion-tab.wrapper.scss',
  template: `
    <p-accordion-panel value="{{key}}">
      <p-accordion-header>{{key}}</p-accordion-header>
      <p-accordion-content>
        <ng-container #fieldComponent></ng-container>
      </p-accordion-content>
    </p-accordion-panel>
  `,
  standalone: false
})
export class FormlyAccordionTabWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
