import { NgModule } from '@angular/core';
import { FormlyInputModule } from './input/input.module';
import { FormlyRadioModule } from './radio/radio.module';
import { FormlySelectModule } from './select/select.module';
import { FormlyTextAreaModule } from './textarea/textarea.module';
import { FormlyCheckboxModule } from './checkbox/checkbox.module';

@NgModule({
  imports: [
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
  ],
})
export class FormlyElvisFOModule {}
