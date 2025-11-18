import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig, FormlyFieldProps as CoreFormlyFieldProps, } from '@ngx-formly/core';

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  hideRequiredMarker?: boolean;
  hideLabel?: boolean;
  colSize?: 12 | 6 | 4;
}

@Component({
  selector: 'formly-wrapper-elvisfo-tabs-wrapper',
  styleUrl: './tabs.wrapper.scss',
  template: `
    <p-card>
      <p-tabs [value]="0">
        <p-tablist>
          @for (field of field.fieldGroup; track $index) {
            <p-tab [value]="$index">{{field.props?.label || field.key}}</p-tab>
          }
        </p-tablist>

        <p-tabpanels>
          @for (field of field.fieldGroup; track $index) {
            <p-tabpanel [value]="$index">
              <formly-field [field]="field"></formly-field>
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </p-card>
  `,
  standalone: false
})
export class FormlyTabsWrapper extends FieldWrapper<FormlyFieldConfig<FormlyFieldProps>> {}
