import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

import { FormlyFieldCheckbox } from './checkbox.type';
import { withFormlyFieldCheckbox } from './checkbox.config';
import { FormlyFormFieldModule } from '../form-field/form-field.module';

@NgModule({
  declarations: [
    FormlyFieldCheckbox
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldCheckbox()),
  ],
})
export class FormlyCheckboxModule {}
