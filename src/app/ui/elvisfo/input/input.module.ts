import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';
import { FormlyFormFieldModule } from '../form-field/form-field.module';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@NgModule({
  declarations: [
    FormlyFieldInput
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyInputModule {}
