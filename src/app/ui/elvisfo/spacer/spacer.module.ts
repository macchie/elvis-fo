import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyFieldSpacer } from './spacer.type';
import { withFormlyFieldSpacer } from './spacer.config';

@NgModule({
  declarations: [
    FormlyFieldSpacer
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forChild(withFormlyFieldSpacer()),
  ],
})
export class FormlySpacerModule {}
