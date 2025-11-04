import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FormlyFieldDatepicker } from './datepicker.type';
import { withFormlyFieldDatepicker } from './datepicker.config';
import { FormlyFormFieldModule } from '../form-field/form-field.module';

@NgModule({
  declarations: [
    FormlyFieldDatepicker
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldDatepicker()),
  ],
})
export class FormlyDatepickerModule {}
