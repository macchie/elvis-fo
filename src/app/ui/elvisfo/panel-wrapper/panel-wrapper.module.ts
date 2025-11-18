import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyValidationMessage } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyPanelWrapper } from './panel-wrapper.wrapper';
import { withFormlyPanelWrapper } from './panel-wrapper.config';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
  declarations: [
    FormlyPanelWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyValidationMessage,
    FormlyModule.forChild(withFormlyPanelWrapper()),
    PanelModule,
    FieldsetModule
  ],
})
export class FormlyPanelWrapperModule {}
