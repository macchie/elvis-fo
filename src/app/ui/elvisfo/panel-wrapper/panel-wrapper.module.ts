import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyValidationMessage } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyPanelWrapper } from './panel-wrapper.wrapper';
import { withFormlyPanelWrapper } from './panel-wrapper.config';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    FormlyPanelWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyValidationMessage,
    FormlyModule.forChild(withFormlyPanelWrapper()),
    CardModule
  ],
})
export class FormlyPanelWrapperModule {}
