import { NgModule } from '@angular/core';
import { FormlyFormFieldModule } from './form-field/form-field.module';
import { FormlyInputModule } from './input/input.module';
import { FormlyRadioModule } from './radio/radio.module';
import { FormlySelectModule } from './select/select.module';
import { FormlyTextAreaModule } from './textarea/textarea.module';
import { FormlyCheckboxModule } from './checkbox/checkbox.module';

@NgModule({
  imports: [
    FormlyFormFieldModule,
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
  ],
})
export class FormlyElvisFOModule {}
