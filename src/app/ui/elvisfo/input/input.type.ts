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
      <p-inputgroup-addon *ngIf="props.prefixIcon || props.prefixText">
        <i *ngIf="props.prefixIcon" [class]="props.prefixIcon"></i>
        <span *ngIf="props.prefixText" [innerHTML]="props.prefixText"></span>
      </p-inputgroup-addon>

      <input
        pInputText fluid
        *ngIf="props.type !== 'number'; else numberTmp"
        [type]="props.type || 'text'"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <ng-template #numberTmp>
        <input pInputText fluid type="number" [formControl]="formControl" [formlyAttributes]="field" />
      </ng-template>

      <p-inputgroup-addon *ngIf="props.suffixIcon || props.suffixText">
        <i *ngIf="props.suffixIcon" [class]="props.suffixIcon"></i>
        <span *ngIf="props.suffixText" [innerHTML]="props.suffixText"></span>
      </p-inputgroup-addon>
    </p-inputgroup>

    <small *ngIf="props.helpText" [innerHTML]="props.helpText"></small>
  `,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {

  constructor( ) {
    super();
  }
}
