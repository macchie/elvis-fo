import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { withFormlyAccordionWrapper } from './accordion.wrapper.config';
import { CardModule } from 'primeng/card';
import { FormlyAccordionWrapper } from './accordion.wrapper';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    FormlyAccordionWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyModule.forChild(withFormlyAccordionWrapper()),
    CardModule,
    AccordionModule
  ],
})
export class FormlyAccordionWrapperModule {}
