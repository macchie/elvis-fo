import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { withFormlyTabsWrapper } from './tabs.wrapper.config';
import { CardModule } from 'primeng/card';
import { FormlyTabsWrapper } from './tabs.wrapper';
import { TabsModule } from 'primeng/tabs';

@NgModule({
  declarations: [
    FormlyTabsWrapper
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyModule.forChild(withFormlyTabsWrapper()),
    CardModule,
    TabsModule
  ],
})
export class FormlyTabsWrapperModule {}
