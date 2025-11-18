import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyValidationMessage } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyCardWrapper } from './card-wrapper.wrapper';
import { withFormlyCardWrapper } from './card-wrapper.config';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    FormlyCardWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyValidationMessage,
    FormlyModule.forChild(withFormlyCardWrapper()),
    CardModule
  ],
})
export class FormlyCardWrapperModule {}
