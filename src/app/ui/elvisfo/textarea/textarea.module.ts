import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FormlyFieldTextArea } from './textarea.type';
import { withFormlyFieldTextArea } from './textarea.config';
import { FormlyFormFieldModule } from '../form-field/form-field.module';

@NgModule({
  declarations: [
    FormlyFieldTextArea
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextareaModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldTextArea()),
  ],
})
export class FormlyTextAreaModule {}
