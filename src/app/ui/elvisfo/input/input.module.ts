import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyValidationMessage } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';
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
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyInputModule {}
