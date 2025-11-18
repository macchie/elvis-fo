import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';

interface SpacerProps { }

export interface FormlyInputFieldConfig extends FormlyFieldConfig<SpacerProps> {
  type: 'input' | Type<FormlyFieldSpacer>;
}

@Component({
  selector: 'formly-field-elvisfo-spacer',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` `,
})
export class FormlyFieldSpacer extends FieldType<FieldTypeConfig<SpacerProps>> {

  public _displayValue?: string;
  public _helpText?: string;

  constructor( ) {
    super();
  }

}
