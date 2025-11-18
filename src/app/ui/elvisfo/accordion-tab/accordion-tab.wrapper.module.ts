import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { withFormlyAccordionTabWrapper } from './accordion-tab.wrapper.config';
import { CardModule } from 'primeng/card';
import { FormlyAccordionTabWrapper } from './accordion-tab.wrapper';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    FormlyAccordionTabWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyModule.forChild(withFormlyAccordionTabWrapper()),
    CardModule,
    AccordionModule
  ],
})
export class FormlyAccordionTabWrapperModule {}
